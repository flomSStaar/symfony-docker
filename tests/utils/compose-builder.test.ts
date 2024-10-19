import { describe, expect, it } from 'bun:test'
import { ComposeBuilder } from '@/utils/compose-builder'
import { YAMLMap } from 'yaml'

describe('constructor', () => {
  it('should create an empty compose builder', () => {
    const builder = new ComposeBuilder()

    const result = builder.toString()
    expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  {}\n')
  })

  it('should create a compose builder from a string with empty value', () => {
    const builder = ComposeBuilder.from('volumes:\n  {}\nservices:\n  {}\n')

    const result = builder.toString()
    expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  {}\n')
  })

  it('should create a compose builder from a string with values', () => {
    const builder = ComposeBuilder.from('volumes:\n  volume1:\n    driver: local\nservices:\n  service1:\n    image: nginx\n')

    const result = builder.toString()
    expect(result).toStrictEqual('volumes:\n  volume1:\n    driver: local\nservices:\n  service1:\n    image: nginx\n')
  })
})

describe('volumes', () => {
  describe('addVolume', () => {
    it('should add one volume', () => {
      const builder = new ComposeBuilder()

      builder.addVolume('volume1', {
        driver: 'local',
      })

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  volume1:\n    driver: local\nservices:\n  {}\n')
    })

    it('should add multiples volumes', () => {
      const builder = new ComposeBuilder()

      builder.addVolume('volume1', {
        driver: 'local',
      })

      builder.addVolume('volume2', {
        driver: 'local',
      })

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  volume1:\n    driver: local\n  volume2:\n    driver: local\nservices:\n  {}\n')
    })

    it('should throw if the volume to add has the same name', () => {

      expect(() => {
        const builder = new ComposeBuilder()

        builder.addVolume('volume1', {
          driver: 'local',
        })

        builder.addVolume('volume1', {
          driver: 'local',
        })
      }).toThrow(new Error('Key volume1 already set'))
    })
  })

  describe('removeVolume', () => {
    it('should remove one volume from empty volumes', () => {
      const builder = new ComposeBuilder()

      builder.removeVolume('volume1')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  {}\n')
    })

    it('should remove one volume from multiple volumes', () => {
      const builder = new ComposeBuilder()

      builder.addVolume('volume1', {
        driver: 'local',
      })

      builder.addVolume('volume2', {
        driver: 'local',
      })

      builder.removeVolume('volume1')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  volume2:\n    driver: local\nservices:\n  {}\n')
    })

    it('should remove multiple volumes from multiple volumes', () => {
      const builder = new ComposeBuilder()

      builder.addVolume('volume1', {
        driver: 'local',
      })

      builder.addVolume('volume2', {
        driver: 'local',
      })

      builder.removeVolume('volume1')
      builder.removeVolume('volume2')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  {}\n')
    })

    it('should remove all volumes from multiple volumes', () => {
      const builder = new ComposeBuilder()

      builder.addVolume('volume1', {
        driver: 'local',
      })

      builder.addVolume('volume2', {
        driver: 'local',
      })

      builder.removeVolume('volume1')
      builder.removeVolume('volume2')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  {}\n')
    })
  })

  describe('hasVolume', () => {
    it('should return true if the volume exists', () => {
      const builder = new ComposeBuilder()

      builder.addVolume('volume1', {
        driver: 'local',
      })

      const result = builder.hasVolume('volume1')
      expect(result).toStrictEqual(true)
    })

    it('should return false if the volume does not exist', () => {
      const builder = new ComposeBuilder()

      const result = builder.hasVolume('volume1')
      expect(result).toStrictEqual(false)
    })
  })
})

describe('services', () => {
  describe('addService', () => {
    it('should add one service', () => {
      const builder = new ComposeBuilder()

      builder.addService('service1', {
        image: 'nginx',
      })

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n')
    })

    it('should add multiples services', () => {
      const builder = new ComposeBuilder()

      builder.addService('service1', {
        image: 'nginx',
      })

      builder.addService('service2', {
        image: 'nginx',
      })

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n  service2:\n    image: nginx\n')
    })

    it('should throw if the service to add has the same name', () => {
      expect(() => {
        const builder = new ComposeBuilder()

        builder.addService('service1', {
          image: 'nginx',
        })

        builder.addService('service1', {
          image: 'nginx',
        })
      }).toThrow(new Error('Key service1 already set'))
    })
  })

  describe('removeService', () => {
    it('should remove one service from empty services', () => {
      const builder = new ComposeBuilder()

      builder.removeService('service1')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  {}\n')
    })

    it('should remove one service from multiple services', () => {
      const builder = new ComposeBuilder()

      builder.addService('service1', {
        image: 'nginx',
      })

      builder.addService('service2', {
        image: 'nginx',
      })

      builder.removeService('service1')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service2:\n    image: nginx\n')
    })

    it('should remove multiple services from multiple services', () => {
      const builder = new ComposeBuilder()

      builder.addService('service1', {
        image: 'nginx',
      })

      builder.addService('service2', {
        image: 'nginx',
      })

      builder.removeService('service1')
      builder.removeService('service2')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  {}\n')
    })

    it('should remove all services from multiple services', () => {
      const builder = new ComposeBuilder()

      builder.addService('service1', {
        image: 'nginx',
      })

      builder.addService('service2', {
        image: 'nginx',
      })

      builder.removeService('service1')
      builder.removeService('service2')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  {}\n')
    })
  })

  describe('hasService', () => {
    it('should return true if the service exists', () => {
      const builder = new ComposeBuilder()

      builder.addService('service1', {
        image: 'nginx',
      })

      const result = builder.hasService('service1')
      expect(result).toStrictEqual(true)
    })

    it('should return false if the service does not exist', () => {
      const builder = new ComposeBuilder()

      const result = builder.hasService('service1')
      expect(result).toStrictEqual(false)
    })
  })
})

describe('volumes and services', () => {
  describe('add volume and service', () => {
    it('should add one volume and one service', () => {
      const builder = new ComposeBuilder()

      builder.addVolume('volume1', {
        driver: 'local',
      })

      builder.addService('service1', {
        image: 'nginx',
      })

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  volume1:\n    driver: local\nservices:\n  service1:\n    image: nginx\n')
    })

    it('should add multiple volumes and multiple services', () => {
      const builder = new ComposeBuilder()

      builder.addVolume('volume1', {
        driver: 'local',
      })

      builder.addVolume('volume2', {
        driver: 'local',
      })

      builder.addService('service1', {
        image: 'nginx',
      })

      builder.addService('service2', {
        image: 'mariadb',
      })

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  volume1:\n    driver: local\n  volume2:\n    driver: local\nservices:\n  service1:\n    image: nginx\n  service2:\n    image: mariadb\n')
    })
  })

  describe('remove volume and service', () => {
    // Add tests for removing volumes and services

    // Write tests for the following cases:
    // - it should remove one volume and one service from empty volumes and services
    // - it should remove one volume and one service from multiple volumes and services
    // - it should remove multiple volumes and multiple services from multiple volumes and services

    it('should remove one volume and one service from empty volumes and services', () => {
      const builder = new ComposeBuilder()

      builder.removeVolume('volume1')
      builder.removeService('service1')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  {}\n')
    })

    it('should remove one volume and one service from one volume and one service', () => {
      const builder = new ComposeBuilder()

      builder.addVolume('volume1', {
        driver: 'local',
      })
      builder.addService('service1', {
        image: 'nginx',
      })

      builder.removeVolume('volume1')
      builder.removeService('service1')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  {}\n')
    })

    it('should remove one volume and one service from multiple volumes and services', () => {
      const builder = new ComposeBuilder()

      builder.addVolume('volume1', {
        driver: 'local',
      })
      builder.addVolume('volume2', {
        driver: 'local',
      })

      builder.addService('service1', {
        image: 'nginx',
      })
      builder.addService('service2', {
        image: 'mariadb',
      })

      builder.removeVolume('volume1')
      builder.removeService('service1')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  volume2:\n    driver: local\nservices:\n  service2:\n    image: mariadb\n')
    })

    it('should remove multiples volumes and multiples services from multiples volumes and services', () => {
      const builder = new ComposeBuilder()

      builder.addVolume('volume1', {
        driver: 'local',
      })
      builder.addVolume('volume2', {
        driver: 'local',
      })
      builder.addVolume('volume3', {
        driver: 'local',
      })
      builder.addVolume('volume4', {
        driver: 'local',
      })

      builder.addService('service1', {
        image: 'nginx',
      })
      builder.addService('service2', {
        image: 'mariadb',
      })
      builder.addService('service3', {
        image: 'redis',
      })
      builder.addService('service4', {
        image: 'postgres',
      })

      builder.removeVolume('volume1')
      builder.removeVolume('volume2')
      builder.removeService('service1')
      builder.removeService('service2')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  volume3:\n    driver: local\n  volume4:\n    driver: local\nservices:\n  service3:\n    image: redis\n  service4:\n    image: postgres\n')
    })
  })
})

describe('env variables', () => {
  it('should add one env variable', () => {
    const builder = new ComposeBuilder()

    builder.addService('service1', {
      image: 'nginx',
    })

    builder.addEnvVariable('service1', 'KEY1', 'VALUE1')

    const result = builder.toString()
    expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n    environment:\n      KEY1: VALUE1\n')
  })

  it('should remove env variable in map', () => {
    const builder = new ComposeBuilder()

    builder.addService('service1', {
      image: 'nginx',
      environment: {
        KEY1: 'VALUE1',
        KEY2: 'VALUE2',
      },
    })

    builder.removeEnvVariable('service1', 'KEY1', 'VALUE1')

    const result = builder.toString()
    expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n    environment:\n      KEY2: VALUE2\n')
  })

  it('shoud remove env variable in sequence', () => {
    const builder = ComposeBuilder.from('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n    environment:\n      - KEY1=VALUE1\n      - KEY2=VALUE2\n')

    builder.removeEnvVariable('service1', 'KEY1', 'VALUE1')

    const result = builder.toString()
    expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n    environment:\n      - KEY2=VALUE2\n')
  })

  it('should remove env variable in map when the value is different', () => {
    const builder = new ComposeBuilder()

    builder.addService('service1', {
      image: 'nginx',
      environment: {
        KEY1: 'VALUE1',
        KEY2: 'VALUE2',
      },
    })

    builder.removeEnvVariable('service1', 'KEY1', 'VALUE2')

    const result = builder.toString()
    expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n    environment:\n      KEY2: VALUE2\n')
  })

  it('should not remove env variable in sequence when the value is different', () => {
    const builder = ComposeBuilder.from('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n    environment:\n      - KEY1=VALUE1\n      - KEY2=VALUE2\n')

    builder.removeEnvVariable('service1', 'KEY1', 'VALUE2')

    const result = builder.toString()
    expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n    environment:\n      - KEY1=VALUE1\n      - KEY2=VALUE2\n')
  })
})

describe('depends_on', () => {
  describe('addDependsOn', () => {
    it('should add depends_on', () => {
      const builder = new ComposeBuilder()

      builder.addService('service1', {
        image: 'nginx',
      })

      builder.addService('service2', {
        image: 'nginx',
      })

      builder.addDependsOn('service1', 'service2')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n    depends_on:\n      - service2\n  service2:\n    image: nginx\n')
    })

    it('should duplicate dependsOn dependency', () => {
      const builder = new ComposeBuilder()

      builder.addService('service1', {
        image: 'nginx',
        depends_on: ['service2'],
      })

      builder.addDependsOn('service1', 'service2')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n    depends_on:\n      - service2\n      - service2\n')
    })

  })

  describe('removeDependsOn', () => {
    it('should remove depends_on', () => {
      const builder = new ComposeBuilder()

      builder.addService('service1', {
        image: 'nginx',
        depends_on: ['service2'],
      })

      builder.removeDependsOn('service1', 'service2')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n    depends_on:\n      []\n')
    })

    it('should not remove depends_on if the dependency does not exist in the service', () => {
      const builder = new ComposeBuilder()

      builder.addService('service1', {
        image: 'nginx',
      })

      builder.removeDependsOn('service1', 'service2')

      const result = builder.toString()
      expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n')
    })
  })
})

describe('sequence', () => {
  class ComposeBuilderExtend extends ComposeBuilder {
    addInSequence(service: YAMLMap, nodeKey: string, value: string) {
      super.addInSequence(service, nodeKey, value)
    }

    removeInSequence(service: YAMLMap, nodeKey: string, value: string) {
      super.removeInSequence(service, nodeKey, value)
    }
  }

  it('should add value in sequence', () => {
    const builder = new ComposeBuilderExtend()

    builder.addService('service1', {
      image: 'nginx',
    })

    builder.addInSequence(builder.getService('service1')!, 'depends_on', 'service2')

    const result = builder.toString()
    expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n    depends_on:\n      - service2\n')
  })

  it('should remove value in sequence', () => {
    const builder = new ComposeBuilderExtend()

    builder.addService('service1', {
      image: 'nginx',
      depends_on: ['service2'],
    })

    builder.removeInSequence(builder.getService('service1')!, 'depends_on', 'service2')

    const result = builder.toString()
    expect(result).toStrictEqual('volumes:\n  {}\nservices:\n  service1:\n    image: nginx\n    depends_on:\n      []\n')
  })
})
import kleur from 'kleur'

export const logger = {
  i: (message: string, bold: boolean = true) => {
    let output = kleur.white(message)
    if (bold) {
      output = kleur.bold(output)
    }
    console.log(output)
  },
  e: (message: string, bold: boolean = true) => {
    let output = kleur.red(message)
    if (bold) {
      output = kleur.bold(output)
    }
    console.log(output)
  },
  success: (message: string, bold: boolean = true) => {
    let output = kleur.green(message)
    if (bold) {
      output = kleur.bold(output)
    }
    console.log(output)
  },
}

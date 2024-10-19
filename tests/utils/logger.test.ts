import { describe, expect, it, spyOn } from 'bun:test'
import { logger } from '@/utils/logger' // Remplacez par le chemin correct vers votre fichier logger
import kleur from 'kleur'

describe("Logger tests", () => {
  it("should log white message in bold by default", () => {
    const spy = spyOn(console, 'log').mockImplementation(() => {});
    const message = "Info message";

    logger.i(message);

    expect(spy).toHaveBeenCalledWith(kleur.bold(kleur.white(message)));
    spy.mockRestore();
  });

  it("should log white message without bold", () => {
    const spy = spyOn(console, 'log').mockImplementation(() => {});
    const message = "Info message";

    logger.i(message, false);

    expect(spy).toHaveBeenCalledWith(kleur.white(message));
    spy.mockRestore();
  });

  it("should log red message in bold by default", () => {
    const spy = spyOn(console, 'log').mockImplementation(() => {});
    const message = "Error message";

    logger.e(message);

    expect(spy).toHaveBeenCalledWith(kleur.bold(kleur.red(message)));
    spy.mockRestore();
  });

  it("should log red message without bold", () => {
    const spy = spyOn(console, 'log').mockImplementation(() => {});
    const message = "Error message";

    logger.e(message, false);

    expect(spy).toHaveBeenCalledWith(kleur.red(message));
    spy.mockRestore();
  });

  it("should log green message in bold by default", () => {
    const spy = spyOn(console, 'log').mockImplementation(() => {});
    const message = "Success message";

    logger.success(message);

    expect(spy).toHaveBeenCalledWith(kleur.bold(kleur.green(message)));
    spy.mockRestore();
  });

  it("should log green message without bold", () => {
    const spy = spyOn(console, 'log').mockImplementation(() => {});
    const message = "Success message";

    logger.success(message, false);

    expect(spy).toHaveBeenCalledWith(kleur.green(message));
    spy.mockRestore();
  });
});

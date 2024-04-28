import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { setTimeout } from "node:timers/promises";
import Task from "../src/task.js";

describe("Task Test Suite", () => {
  let _logMock;
  let _task;
  beforeEach(() => {
    _logMock = jest.spyOn(console, console.log.name).mockImplementation();
    _task = new Task();
  });
  it.skip("should only run tasks that are due with fake timers (slow)", async () => {
    // Arrange
    const tasks = [
      {
        name: "Task-will-run-in-5-secs",
        dueAt: new Date(Date.now() + 5000),
        fn: jest.fn(),
      },
      {
        name: "Task-will-run-in-10-secs",
        dueAt: new Date(Date.now() + 10000),
        fn: jest.fn(),
      },
    ];

    // Act
    _task.save(tasks.at(0));
    _task.save(tasks.at(1));
    _task.run(200);

    await setTimeout(11e3); // 11_000

    // Assert
    expect(tasks.at(0).fn).toHaveBeenCalled();
    expect(tasks.at(1).fn).toHaveBeenCalled();
    //   Configurar para o jest aguardar 15 segundos nesse test
  }, 15e3);
  it("should only run tasks that are due with fake timers (fast)", async () => {
    //Testes unitários não podem depender de tempo, ambiente e interação externa

    jest.useFakeTimers();
    // Arrange
    const tasks = [
      {
        name: "Task-will-run-in-5-secs",
        dueAt: new Date(Date.now() + 5000),
        fn: jest.fn(),
      },
      {
        name: "Task-will-run-in-10-secs",
        dueAt: new Date(Date.now() + 10000),
        fn: jest.fn(),
      },
    ];

    // Act
    _task.save(tasks.at(0));
    _task.save(tasks.at(1));
    _task.run(200);

    // Assert
    // Avançando no tempo do que ficar esperando manualmente no tempo
    jest.advanceTimersByTime(4000);
    expect(tasks.at(0).fn).not.toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);
    expect(tasks.at(0).fn).toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(4000);
    expect(tasks.at(1).fn).toHaveBeenCalled();

    //Depois se quiser usar tempo real pode usar o jest.useRealTimers() no beforeEach
  }, 15e3);
});

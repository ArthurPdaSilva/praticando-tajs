import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import Task from "../src/task.js";

describe("Task Test Suite", () => {
  let _logMock;
  let _task;
  beforeEach(() => {
    _logMock = jest.spyOn(console, "log").mockImplementation();
    _task = new Task();
  });
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
  it("should print tasks finished if tasks size is empty ", async () => {
    // Arrange
    jest.useFakeTimers();
    const tasks = [
      {
        name: "Task-will-run-in-2-secs",
        dueAt: new Date(Date.now() + 2000),
        fn: jest.fn(),
      },
    ];

    // Act
    _task.save(tasks.at(0));
    _task.run(200);

    // Assert
    jest.advanceTimersByTime(3000);
    expect(_logMock).toHaveBeenCalledTimes(2);
    expect(_logMock).toHaveBeenCalledWith("task finished");
  });
});

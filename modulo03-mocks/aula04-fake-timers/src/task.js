export default class Task {
  #tasks = new Set(); //Estrutura de dados que nunca se repetem
  save({ name, dueAt, fn }) {
    console.log(
      `task [${name}] saved and will be executed at ${dueAt.toISOString()}`
    );
    // Como é objeto ele tá pouco ligando para não se repeter
    this.#tasks.add({ name, dueAt, fn });
  }
  run(everyMs) {
    const intervalId = setInterval(() => {
      const now = new Date();
      if (this.#tasks.size === 0) {
        console.log("task finished");
        clearInterval(intervalId);
        return;
      }
      for (const task of this.#tasks) {
        if (task.dueAt <= now) {
          task.fn();
          this.#tasks.delete(task);
        }
      }
    }, everyMs);
  }
}

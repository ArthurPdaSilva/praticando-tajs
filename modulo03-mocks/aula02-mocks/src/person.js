class Person {
  static validate(person) {
    if (!person.name) {
      throw new Error("Name is required");
    }
    if (!person.cpf) {
      throw new Error("CPF is required");
    }
  }

  static format(person) {
    const [name, ...lastName] = person.name.split(" ");
    return {
      cpf: person.cpf.replace(/\D/g, ""),
      name: name,
      lastName: lastName.join(" "),
    };
  }

  static save(person) {
    const requiredProps = ["cpf", "name", "lastName"];
    if (!requiredProps.every((prop) => person[prop])) {
      throw new Error("Invalid person");
    }
    // Salva a pessoa no banco de dados
    console.log("Registrado com sucesso");
  }

  static process(person) {
    this.validate(person);
    const formattedPerson = this.format(person);
    this.save(formattedPerson);
    return "ok";
  }
}

export default Person;

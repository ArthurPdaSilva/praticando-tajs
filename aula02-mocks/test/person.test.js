import { describe, jest } from "@jest/globals";
import Person from "../src/person.js";

describe("#person Suite", () => {
  describe("#validate", () => {
    it("should throw an error if name is not provided", () => {
      const mockInvalidPerson = {
        name: "",
        cpf: 12321,
      };
      expect(() => {
        Person.validate(mockInvalidPerson);
      }).toThrow(new Error("Name is required"));
    });
    it("should throw an error if cpf is not provided", () => {
      const mockInvalidPerson = {
        name: "John",
        cpf: "",
      };
      expect(() => {
        Person.validate(mockInvalidPerson);
      }).toThrow(new Error("CPF is required"));
    });
    it("Shoud not throw an error if name and cpf are provided", () => {
      const mockValidPerson = {
        name: "John",
        cpf: "123456789",
      };
      expect(() => {
        Person.validate(mockValidPerson);
      }).not.toThrow();
    });
  });
  describe("#format", () => {
    // Parte do princípio que os dados já foram validados
    it("Should return a person with name and CPF", () => {
      // AAA

      // Arrange
      const mockPerson = {
        name: "John Doe Silva",
        cpf: "123.456.789",
      };

      // Act
      const formattedPerson = Person.format(mockPerson);

      // Assert
      expect(formattedPerson).toStrictEqual({
        name: "John",
        lastName: "Doe Silva",
        cpf: "123456789",
      });
    });
  });
  describe("#save", () => {
    it("Should throw an error if person is invalid", () => {
      const mockInvalidPerson = {
        name: "John",
        cpf: "123456789",
      };
      expect(() => {
        Person.save(mockInvalidPerson);
      }).toThrow(new Error("Invalid person"));
    });
    it("Should save a person in the database", () => {
      const mockValidPerson = {
        name: "John Doe",
        lastName: "Silva",
        cpf: "123456789",
      };
      expect(() => {
        Person.save(mockValidPerson);
      }).not.toThrow();
    });
  });
  describe("#process", () => {
    it("should process a valid person", () => {
      // Este método abaixo faz mais sentido para quando se tem interações externas como
      // banco de dados, requisições HTTP, etc.
      // Mocks são utilizados para simular essas interações

      // AAA

      // Arrange
      const mockPerson = {
        name: "John Doe",
        cpf: "123456789",
      };

      jest
        .spyOn(Person, Person.validate.name)
        // .mockImplementation(() => throw new Error("Name is required") //Forçar error
        .mockReturnValue(); //Aqui temos um mock para o método validate que retornar true quando ele for chamado

      jest.spyOn(Person, Person.format.name).mockReturnValue({
        name: "John",
        lastName: "Doe",
        cpf: "123456789",
      });

      // Act
      const result = Person.process(mockPerson);

      // Assert
      expect(result).toBe("ok");
    });
  });
});

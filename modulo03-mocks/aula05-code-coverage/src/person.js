export function mapPerson(personStr) {
  const { name, age } = JSON.parse(personStr);
  return { name, age, createdAt: new Date() };
}

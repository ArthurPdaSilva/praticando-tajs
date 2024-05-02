import axios from "axios";
async function fetchAPIByPage(page = 1, counter = 1) {
  const { data } = await axios.get(
    `https://rickandmortyapi.com/api/character/?page=${page}`
  );
  const result = data?.results?.slice(0, counter).map((item) => {
    return {
      id: item.id,
      name: item.name,
      image: item.image,
    };
  });
  return result;
}
export { fetchAPIByPage };

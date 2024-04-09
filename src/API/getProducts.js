export const getProducts = async (page = 0, limit = 10) => {
    const response = await fetch(`http://localhost:3000/product?_start=${page}&_limit=${limit}`);
    const data = await response.json();
    return data;
}

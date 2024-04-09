export const getAllProducts = async () => {
    const response = await fetch('http://localhost:3000/product');
    const data = await response.json();
    
    return data;
}

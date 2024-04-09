const getTotalProductsCount = async () => {
    try {
        const response = await fetch(`http://localhost:3000/product`);
        const data = await response.json();
        return data.length;
    } catch (error) {
        console.error('Error fetching total products count:', error);
        throw error;
    }
}

export default getTotalProductsCount;
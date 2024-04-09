import React from 'react';

const Pages = ({ currentPage, totalPages, onPageChange, setProducts }) => {
    const handleClick = async (page) => {
        onPageChange(page);
        try {
            const response = await fetch(`http://localhost:3000/product?_start=${(page - 1) * 10}&_limit=10`);
            const data = await response.json();
            setProducts(data);
            console.log(data);
        } catch(error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => handleClick(currentPage - 1)} className="btn-page">&#60;</button>

            {[...Array(totalPages)].map((_, index) => (
                <button key={index + 1} onClick={() => handleClick(index + 1)} className="btn-page">{index + 1}</button>
                // <button key={index + 1} onClick={() => handleClick(index + 1)} className={currentPage === index + 1 ? "active btn-page" : "btn-page"}>{index + 1}</button>
            ))}

            <button disabled={currentPage === totalPages} onClick={() => handleClick(currentPage + 1)} className="btn-page">&#62;</button>
        </div>
    );
};

export default Pages;
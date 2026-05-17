import React from 'react';
import { Link } from 'react-router-dom';

const CategoryItem = ({ category }) => {
    const categoryName = category.categoryName || category.name || "Danh mục";
    const categoryId = category.categoryId || category.id;

    // Default icons/images for categories based on name keywords if no image is provided
    let imageUrl = "https://cdn-icons-png.flaticon.com/512/3502/3502688.png"; // Generic box icon

    const lowerName = categoryName.toLowerCase();

    if (lowerName.includes("sneaker")) {
        imageUrl = "https://cdn-icons-png.flaticon.com/512/2589/2589903.png"; // Sneaker
    } else if (lowerName.includes("boot")) {
        imageUrl = "https://cdn-icons-png.flaticon.com/512/2315/2315410.png"; // Boot
    } else if (lowerName.includes("sport") || lowerName.includes("running")) {
        imageUrl = "https://cdn-icons-png.flaticon.com/512/763/763816.png"; // Running Shoe
    } else if (lowerName.includes("formal") || lowerName.includes("oxford") || lowerName.includes("tây")) {
        imageUrl = "https://cdn-icons-png.flaticon.com/512/2934/2934098.png"; // Formal Shoe
    }

    if (category.image) {
        if (category.image.startsWith("http")) {
            imageUrl = category.image;
        } else {
            imageUrl = `${process.env.REACT_APP_API_BASE_URL}/api/public/categories/image/${category.image}`;
        }
    }

    return (
        <div className="col-lg-3 col-md-4 col-6 mb-4">
            <Link to={`/category/${categoryId}`} className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm text-center card-hover-effect overflow-hidden">
                    <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '180px' }}>
                        <div className="mb-3 rounded-circle bg-light d-flex align-items-center justify-content-center shadow-inner" style={{ width: '100px', height: '100px' }}>
                            <img
                                src={imageUrl}
                                alt={categoryName}
                                className="img-fluid"
                                style={{ maxHeight: '60%', maxWidth: '60%', objectFit: 'contain' }}
                                onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/3502/3502688.png'; e.target.onerror = null; }}
                            />
                        </div>
                        <h6 className="card-title font-weight-bold text-dark mb-0 stretch-link">
                            {categoryName}
                        </h6>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default CategoryItem;

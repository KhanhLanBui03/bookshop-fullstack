import { useState } from 'react';

// Image Gallery Component
const ImageGallery = ({ images, discount }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
                <img
                    src={images[selectedImage]}
                    alt="Book cover"
                    className="w-full h-[500px] object-cover"
                />
                {discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                        -{discount}%
                    </div>
                )}
            </div>

            <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                            ? 'border-blue-500'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-20 object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
};
export default ImageGallery;
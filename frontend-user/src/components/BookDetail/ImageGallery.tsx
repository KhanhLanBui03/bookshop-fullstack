import { useState } from 'react';
import { Button } from '../ui/button';

// Image Gallery Component
const ImageGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!images?.length) {
        return <div className="h-[500px] bg-gray-100 rounded-xl" />
    }

    return (
        <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
                <img
                    src={images[selectedImage].url}
                    alt="Book cover"
                    className="w-full h-[500px] object-cover"
                />
            </div>

            <div className="grid grid-cols-5 gap-2">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`
              aspect-square
              rounded-lg
              overflow-hidden
              border-2
              transition-all
              ${selectedImage === idx
                                ? 'border-blue-500'
                                : 'border-gray-200 hover:border-gray-300'}
            `}
                    >
                        <img
                            src={img.url}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};
export default ImageGallery;
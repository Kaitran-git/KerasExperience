import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, Clipboard } from 'lucide-react';

const ImageUploader = ({ currentImage, onImageUpload }) => {
    const [error, setError] = useState(null);

    const handlePasteClick = async (e) => {
        e.stopPropagation(); // prevent triggering dropzone
        setError(null);
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const clipboardItem of clipboardItems) {
                const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
                for (const imageType of imageTypes) {
                    const blob = await clipboardItem.getType(imageType);
                    const file = new File([blob], `pasted_image_${Date.now()}.png`, { type: blob.type || 'image/png' });
                    onImageUpload(file);
                    return;
                }
            }
            setError('No image found in clipboard');
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
            setError('Please allow clipboard access or use Ctrl+V to paste');
        }
    };

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        setError(null);
        if (fileRejections.length > 0) {
            setError('Please upload a valid image file (PNG, JPG, JPEG)');
            return;
        }

        if (acceptedFiles && acceptedFiles.length > 0) {
            onImageUpload(acceptedFiles[0]);
        }
    }, [onImageUpload]);

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1,
        multiple: false
    });

    React.useEffect(() => {
        const handlePaste = (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        const file = new File([blob], `pasted_image_${Date.now()}.png`, { type: blob.type || 'image/png' });
                        onImageUpload(file);
                        e.preventDefault();
                        break;
                    }
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [onImageUpload]);

    return (
        <div className="w-full flex-1 flex flex-col min-h-[300px]">
            {!currentImage ? (
                <div
                    {...getRootProps()}
                    className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer
            ${isDragAccept ? 'border-green-500 bg-green-500/10' : ''}
            ${isDragReject ? 'border-red-500 bg-red-500/10' : ''}
            ${isDragActive && !isDragReject && !isDragAccept ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' : ''}
            ${!isDragActive ? 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/60 hover:border-blue-500/50' : ''}
          `}
                >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-lg">
                        <UploadCloud size={32} className={`
              ${isDragAccept ? 'text-green-400' : ''}
              ${isDragReject ? 'text-red-400' : ''}
              ${!isDragAccept && !isDragReject ? 'text-blue-400' : ''}
            `} />
                    </div>

                    <h3 className="text-xl font-medium text-white mb-2 text-center">
                        {isDragActive ? 'Drop your image here' : 'Select a file, drag & drop, or paste (Ctrl+V) here'}
                    </h3>
                    <p className="text-sm text-slate-400 text-center mb-6">
                        JPG, PNG, TIFF, or WEBP, file size no more than 10MB
                    </p>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-colors flex items-center gap-2 cursor-pointer">
                            <UploadCloud size={18} />
                            <span>Browse Files</span>
                        </div>
                        <button
                            onClick={handlePasteClick}
                            className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium border border-slate-600 shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <Clipboard size={18} />
                            <span>Paste Image</span>
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg">
                            <AlertCircle size={16} />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-1 relative rounded-2xl border border-slate-700 bg-black/50 flex flex-col p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg">
                            <CheckCircle size={16} className="text-green-400" />
                            <span className="text-sm text-slate-200 font-medium tracking-wide">Image Ready</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePasteClick}
                                className="bg-slate-700 hover:bg-slate-600 border border-slate-600 shadow-md text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm z-10"
                            >
                                <Clipboard size={16} />
                                Paste
                            </button>
                            <div {...getRootProps()} className="cursor-pointer">
                                <input {...getInputProps()} />
                                <button className="bg-blue-600 hover:bg-blue-500 border border-blue-500 shadow-lg shadow-blue-900/20 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm z-10">
                                    <UploadCloud size={16} />
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center relative min-h-[250px] bg-slate-900/30 rounded-xl overflow-hidden border border-slate-800">
                        {error && <div className="absolute top-2 w-full flex justify-center z-20"><span className="text-red-400 text-sm bg-red-900/80 backdrop-blur px-3 py-1 rounded-md">{error}</span></div>}
                        <img
                            src={currentImage}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;

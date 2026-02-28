import { addressService } from "@/services/address.service"
import { useState } from "react"


interface Props {
    onClose: () => void
    onSuccess: () => void
}

export default function AddressFormModal({ onClose, onSuccess }: Props) {
    const [form, setForm] = useState({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await addressService.createAddress(form)
            onSuccess()
            onClose()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md rounded-2xl p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl"
                >
                    ×
                </button>

                <h2 className="text-xl font-bold mb-4">
                    Thêm địa chỉ mới
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        name="street"
                        placeholder="Đường"
                        value={form.street}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                    <input
                        name="city"
                        placeholder="Thành phố"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                    <input
                        name="state"
                        placeholder="Tỉnh"
                        value={form.state}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                    <input
                        name="zipCode"
                        placeholder="Mã bưu điện"
                        value={form.zipCode}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                    <input
                        name="country"
                        placeholder="Quốc gia"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                        {loading ? "Đang lưu..." : "Lưu địa chỉ"}
                    </button>
                </form>
            </div>
        </div>
    )
}
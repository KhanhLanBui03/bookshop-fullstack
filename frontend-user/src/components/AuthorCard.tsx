import { Card } from "./ui/card"

type Props = {
  imageUrl: string
  name: string
  bio: string
}

const AuthorCard = ({ imageUrl, name, bio }: Props) => {
  return (
    <Card className="group hover:shadow-lg transition">
      <div className="flex flex-col sm:flex-row items-center sm:items-start p-6 text-center sm:text-left gap-4">

        {/* Avatar */}
        <img
          src={imageUrl}
          alt={name}
          className="w-24 h-24 rounded-full object-cover
                   group-hover:scale-105 transition"
        />

        {/* Info */}
        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-semibold dark:text-white">
            {name}
          </h3>

          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {bio}
          </p>

          {/* CTA (optional) */}
          <span className="mt-3 text-sm font-medium text-blue-600 opacity-0
                         group-hover:opacity-100 transition">
            Xem sách của tác giả →
          </span>
        </div>
      </div>
    </Card>
  )

}

export default AuthorCard

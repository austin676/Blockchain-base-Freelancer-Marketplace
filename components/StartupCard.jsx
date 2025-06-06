import { formatDate } from "@/lib/utils"
import { EyeIcon } from "lucide-react"
import Link from "next/link" 
import { Button } from "./ui/button"


 const StartupCard = ( {post} ) =>{

    const { _createdAt , _id,views , author:{authorId , name} , image ,title , description , category } = post


    return(
        <li className="startup-card group">
            <div className="flex-between">
                <p className="startup_card_date">
                    {formatDate(_createdAt)}
                </p>
                <div className="flex gap-1.5">
                    <EyeIcon className="size-6 text-primary"></EyeIcon>
                    <span className="text-16-medum">{views}</span>
                </div>
            </div>

            <div className="flex-between mt-5 gap-5">
                <div className="flex-1">
                    <Link href={`/user/${authorId}`}>
                        <p className="text-16-medium line-clamp-1">{name}</p>
                    </Link>
                    <Link  href={`/startup/${_id}`}>
                        <h3 className="text-26-semibold line-clamp-1">{title}</h3>
                    </Link>
                </div>
            </div>

            <Link href={`/startups/${_id}`}>
                <p className="startup-card_desc">
                    {description}

                    <img src={image} alt="placeholder" className="start-card_img" />
                </p>
            </Link>

            <div className="flex-between mt-5 gap-3">
                <p className="text-16-medium">{category}</p>

                <Button className='startup-card_btn' asChild>
                    <Link href={`/startup/${_id}`}>
                        Details
                    </Link>
                </Button>
            </div>



        </li>

    )
 }

 export default StartupCard
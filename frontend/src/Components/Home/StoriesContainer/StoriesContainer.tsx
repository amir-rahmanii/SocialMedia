import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { stories } from "../../../utils/constants";

const StoriesContainer = () => {

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 7.5,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1250,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 7,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 2
                }
            }
        ]
    };

    return (
        <>
            <Slider {...settings} className="w-full bg-white pt-2.5 pb-1 px-2.5 flex overflow-hidden border rounded">

                {stories.map((s, i) => (
                    <div className="flex flex-col text-center justify-center items-center p-2 cursor-pointer" key={i}>
                        <div className="w-16 p-[1px] h-16 rounded-full border-2 border-red-500">
                            <img loading="lazy" className="rounded-full h-full w-full border border-gray-300 object-cover" src={`/src/assets/logos/${s.image}.webp`} draggable="false" alt="story" />
                        </div>
                        <span className="text-xs">{s.title}</span>
                    </div>
                ))}

            </Slider>
        </>

    )
}

export default StoriesContainer
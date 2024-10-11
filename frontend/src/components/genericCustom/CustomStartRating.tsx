import { useState } from "react";
import { IoMdStar } from "react-icons/io";
import styles from '../FormComponents.module.css';

interface Props {
    sendRatingValue: any
};

const CustomStarRating = ({ sendRatingValue }: Props) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    function handleStarClick(value: number) {
        setRating(value);
        sendRatingValue(value);
    }

    return (
        <>
            {[...Array(5)].map((value, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={index} id={value}>
                        <IoMdStar                            
                            className={styles.ratingStar}
                            size={20}
                            color={ratingValue <= (hover || rating) ? "#3d00f2" : "#e7e7e7"}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => handleStarClick(ratingValue)}
                        />
                    </label>
                );
            })}
        </>
    )
}
export default CustomStarRating;
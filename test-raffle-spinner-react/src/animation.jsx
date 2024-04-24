import { useState } from 'react';

function AnimationRenderer({ onAnimate, staticSrc, gifSrc, animationDuration, isButtonDisabled, setIsButtonDisabled}) {
    const [imageSrc, setImageSrc] = useState(staticSrc);

    const handleImageClick = () => {
        // checks to see if the button has been clicked to prevent double clicking
        if (isButtonDisabled) return;
        // disables the button on click
        setIsButtonDisabled(true);
        console.log('Starting spin animation');
        setImageSrc(gifSrc); // Switch from static img to the GIF

        setTimeout(() =>{
            onAnimate();
        }, 3200) 

        // Set a timeout to switch back to the static image after the GIF's duration
        setTimeout(() => {
            // setIsButtonDisabled(false); 
            setImageSrc(staticSrc); // Switch back to the static image
        }, animationDuration);

        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 15000);      
    };

    return (
        <img
          id="animation_frame"
            src={imageSrc}
            alt="Animation"
            onClick={handleImageClick}
            style={{ cursor: !isButtonDisabled ? 'pointer':'not-allowed' }}
        />
    );
}

export default AnimationRenderer;
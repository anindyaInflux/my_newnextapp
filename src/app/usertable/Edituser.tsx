import React from 'react'

interface EditIconProps {
    onClick: () => void;
}

const Edituser : React.FC<EditIconProps> = ({ onClick }) => {
    return (
        <span onClick={onClick} role="button" tabIndex={0} style={{ fontSize: '16px' }}> {/* Adjust fontSize as needed */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                 width="1em" height="1em"> {/* Set width and height to 1em */}
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
        </span>
    );
}

export default Edituser
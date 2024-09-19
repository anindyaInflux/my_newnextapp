import React from 'react'


interface DeleteIconProps {
    onClick: () => void;
}


const Deleteuser: React.FC<DeleteIconProps> = ({ onClick }) => {
    return (
        <span onClick={onClick} role="button" tabIndex={0} style={{ fontSize: '16px' }}> 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 width="1em" height="1em">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
        </span>
    );
};

export default Deleteuser
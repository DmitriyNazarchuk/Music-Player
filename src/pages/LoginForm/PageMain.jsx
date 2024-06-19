import React from 'react';

import PageRegister from './PageRegister';
import './PageRegister.css';

const PageMain = ({ props: isLoggedIn }) => {
    return (
        <>
            {isLoggedIn ? (
                <div className="container">
                    <div className="text-center">
                        <h4>Welcome to Youtube Music</h4>
                    </div>
                </div>
            ) : (
                <div className="wrapper">
                    <div className="box">
                        <div className="text-center">
                            <h3>Welcome to Youtube Music</h3>
                            <h4>Please log in or register.</h4>
                        </div>
                    </div>
                    <PageRegister />
                </div>
            )}
        </>
    );
}

export default PageMain;

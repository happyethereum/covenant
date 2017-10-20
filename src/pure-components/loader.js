"use strict";
require('./loader.css');
require('../../styles/fx/shadow.css');
require('../../styles/fx/glow.css');
require('../../styles/fx/fade.css');
const React = require('react');

const Loader = ({ isEnabled }) => {
    return (
        <div className={`fade ${isEnabled ? "show" : "hide"}`}>
            <div className="spinner">
                <div className="spinner-bars">
                    <div className="spinner-bar spinner-bar1 glow"></div>
                    <div className="spinner-bar spinner-bar2 glow"></div>
                    <div className="spinner-bar spinner-bar3 glow"></div>
                </div>
            </div>
            <div className="spinner">
                <div className="spinner-bars">
                    <div className="spinner-bar spinner-bar1"></div>
                    <div className="spinner-bar spinner-bar2"></div>
                    <div className="spinner-bar spinner-bar3"></div>
                </div>
            </div>
        </div>
    );
};

Loader.propTypes = {
    isEnabled: React.PropTypes.bool
};

Loader.defaultProps = {
    isEnabled: true
};

module.exports = Loader;
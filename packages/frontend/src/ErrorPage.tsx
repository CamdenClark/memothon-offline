import React from 'react';
const ErrorPage = (props) => {
    return (
      <div className="box error">
         {props.error}
      </div>
    );
};
export default ErrorPage;

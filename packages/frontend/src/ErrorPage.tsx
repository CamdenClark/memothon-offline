import React from 'react';

interface ErrorPageProps {
  error: string;
}

const ErrorPage: React.FC<ErrorPageProps> = (props) => {
  return (
    <div className="box error">
      {props.error}
    </div>
  );
};

export default ErrorPage;

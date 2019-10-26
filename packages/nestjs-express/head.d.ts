import React from 'react';

interface HeadComponentProps {
  children?: React.ReactNode;
}

declare function HeadComponent(props: HeadComponentProps): JSX.Element;

export = HeadComponent;

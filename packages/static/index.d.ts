import React from 'react';

interface WithChildren {
  children: React.ReactNode;
}

declare namespace ReactSsr {
  export class Document extends React.Component {}
  export function Head(props: WithChildren): JSX.Element;
  export function Main(): JSX.Element;
}

export = ReactSsr;

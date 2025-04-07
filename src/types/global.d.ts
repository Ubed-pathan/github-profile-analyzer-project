import * as React from 'react';

declare global {
  namespace JSX {
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

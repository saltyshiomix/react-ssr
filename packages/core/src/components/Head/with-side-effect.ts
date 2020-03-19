import React from 'react';

const isServer = typeof window === 'undefined';

type State = Array<React.ReactElement<any>> | undefined;

type SideEffectProps = {
  reduceComponentsToState: <T>(
    components: Array<React.ReactElement<any>>,
    props: T,
  ) => State;
};

export default () => {
  const mountedInstances: Set<any> = new Set();
  let state: State;

  function emitChange(component: React.Component<SideEffectProps>) {
    state = component.props.reduceComponentsToState(
      [...mountedInstances],
      component.props,
    );
  }

  return class extends React.Component<SideEffectProps> {
    static rewind() {
      const recordedState = state;
      state = undefined;
      mountedInstances.clear();
      return recordedState;
    }

    constructor(props: any) {
      super(props);
      if (isServer) {
        mountedInstances.add(this);
        emitChange(this);
      }
    }

    componentDidMount() {
      mountedInstances.add(this);
      emitChange(this);
    }

    componentDidUpdate() {
      emitChange(this);
    }

    componentWillUnmount() {
      mountedInstances.delete(this);
      emitChange(this);
    }

    render() {
      return null;
    }
  }
}

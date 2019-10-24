import React from 'react';

interface ScriptComponentProps {
  script: string;
}

declare function ScriptComponent(props: ScriptComponentProps): React.ComponentType<ScriptComponentProps>;

export = ScriptComponent;

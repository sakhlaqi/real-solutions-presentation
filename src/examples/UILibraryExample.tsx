import React from 'react';
import { Button, Input, Card, Heading, Text, Alert } from '@sakhlaqi/ui';

/**
 * Example component demonstrating the @sakhlaqi/ui library usage
 */
export const UILibraryExample: React.FC = () => {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Heading level={1}>UI Library Example</Heading>
      <Text size="lg" color="secondary">
        Testing components from @sakhlaqi/ui package
      </Text>

      <Alert variant="success">
        🎉 Successfully installed @sakhlaqi/ui from GitHub Packages!
      </Alert>

      <Card interactive style={{ marginBottom: '2rem' }}>
        <Heading level={3}>Form Components</Heading>
        <div style={{ marginTop: '1rem' }}>
          <Input
            label="Test Input"
            placeholder="Type something..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <Button variant="primary" onClick={() => alert('Primary clicked!')}>
            Primary Button
          </Button>
          <Button variant="secondary" onClick={() => setInputValue('')}>
            Clear Input
          </Button>
          <Button variant="danger" size="sm">
            Danger
          </Button>
        </div>
      </Card>

      <Card>
        <Heading level={3}>Typography</Heading>
        <Text weight="bold">Bold text</Text>
        <Text size="sm" color="secondary">
          Small secondary text
        </Text>
        <Text size="lg">Large text</Text>
      </Card>
    </div>
  );
};

export default UILibraryExample;

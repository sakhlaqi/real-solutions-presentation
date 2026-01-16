/**
 * Component Showcase Page
 * Displays all components from the @sakhlaqi/ui library
 */

import React, { useState } from 'react';
import {
  // Provider & Context
  useUIContext,
  // Typography
  Heading,
  Text,
  // Layout
  Container,
  Grid,
  GridItem,
  Card,
  Paper,
  Accordion,
  Stack,
  Box,
  Masonry,
  Divider,
  Spacer,
  Section,
  // Buttons
  Button,
  ButtonGroup,
  LinkButton,
  SplitButton,
  ToggleButton,
  // Forms
  Input,
  Textarea,
  TextareaAutosize,
  Select,
  Checkbox,
  Toggle,
  RadioGroup,
  PasswordInput,
  EmailInput,
  NumberInput,
  DatePicker,
  Rating,
  Slider,
  // Data Display
  Badge,
  Avatar,
  List,
  ListItem,
  Tooltip,
  Table,
  Chip,
  Tag,
  TreeView,
  Timeline,
  // Feedback
  Alert,
  Spinner,
  Progress,
  ProgressBar,
  ProgressCircle,
  SkeletonLoader,
  EmptyState,
  Toast,
  Snackbar,
  // Navigation
  Breadcrumbs,
  Tabs,
  Stepper,
  Pagination,
  // Overlay
  Modal,
  Dialog,
  SlideOver,
  // Utility
  useMediaQuery,
} from '@sakhlaqi/ui';
import './ComponentShowcase.css';

const ShowcaseContent: React.FC = () => {
  const { provider, setProvider } = useUIContext();
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [passwordValue, setPasswordValue] = useState('');
  const [ratingValue, setRatingValue] = useState(3);
  const [sliderValue, setSliderValue] = useState(50);
  const [toggleButtonValue, setToggleButtonValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('tab1');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const isTablet = useMediaQuery('md');

  return (
    <div className="component-showcase">
      <Container>
        <div className="showcase-header">
          <Heading level={1}>UI Component Library</Heading>
          <Text size="lg" color="secondary">
            A comprehensive showcase of all components from @sakhlaqi/ui
          </Text>
          
          <Spacer size="md" />
          
          {/* Provider Switcher */}
          <Card padding="md">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
              <div>
                <Text weight="semibold">UI Provider</Text>
                <Text size="sm" color="secondary">
                  Switch between Material-UI and internal components
                </Text>
              </div>
              <ButtonGroup>
                <Button 
                  variant={provider === 'internal' ? 'contained' : 'outlined'}
                  onClick={() => setProvider('internal')}
                >
                  Internal
                </Button>
                <Button 
                  variant={provider === 'mui' ? 'contained' : 'outlined'}
                  onClick={() => setProvider('mui')}
                >
                  Material-UI
                </Button>
              </ButtonGroup>
            </div>
            <Spacer size="sm" />
            <Alert variant="standard">
              Current Provider: <strong>{provider === 'mui' ? 'Material-UI (MUI)' : 'Internal Components'}</strong>
              {provider === 'mui' && ' - Adaptive components now use Material-UI implementation'}
            </Alert>
          </Card>
        </div>

        <Spacer size="xl" />

        {/* Typography Section */}
        <Section>
          <Heading level={2}>Typography</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Card padding="lg">
            <Heading level={3}>Headings</Heading>
            <Spacer size="sm" />
            <Heading level={1}>Heading 1</Heading>
            <Heading level={2}>Heading 2</Heading>
            <Heading level={3}>Heading 3</Heading>
            <Heading level={4}>Heading 4</Heading>
            <Heading level={5}>Heading 5</Heading>
            <Heading level={6}>Heading 6</Heading>
            
            <Spacer size="lg" />
            
            <Heading level={3}>Text Sizes</Heading>
            <Spacer size="sm" />
            <Text size="xs">Extra small text</Text>
            <Text size="sm">Small text</Text>
            <Text size="md">Medium text (default)</Text>
            <Text size="lg">Large text</Text>
            <Text size="xl">Extra large text</Text>
            
            <Spacer size="lg" />
            
            <Heading level={3}>Text Colors</Heading>
            <Spacer size="sm" />
            <Text color="primary">Primary color</Text>
            <Text color="secondary">Secondary color</Text>
            <Text color="muted">Muted color</Text>
            <Text color="error">Error color</Text>
            <Text color="success">Success color</Text>
            
            <Spacer size="lg" />
            
            <Heading level={3}>Text Weights</Heading>
            <Spacer size="sm" />
            <Text weight="light">Light weight</Text>
            <Text weight="normal">Normal weight</Text>
            <Text weight="medium">Medium weight</Text>
            <Text weight="semibold">Semibold weight</Text>
            <Text weight="bold">Bold weight</Text>
          </Card>
        </Section>

        <Spacer size="xl" />

        {/* Buttons Section */}
        <Section>
          <Heading level={2}>Buttons</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Card padding="lg">
            <Heading level={3}>Button Variants</Heading>
            <Spacer size="sm" />
            <div className="showcase-row">
              <Button variant="contained">Contained</Button>
              <Button variant="outlined">Outlined</Button>
              <Button variant="text">Text</Button>
            </div>
            
            <Spacer size="lg" />
            
            <Heading level={3}>Button States</Heading>
            <Spacer size="sm" />
            <div className="showcase-row">
              <Button>Default</Button>
              <Button disabled>Disabled</Button>
              <Button fullWidth>Full Width</Button>
            </div>
            
            <Spacer size="lg" />
            
            <Heading level={3}>Button Group</Heading>
            <Spacer size="sm" />
            <ButtonGroup>
              <Button>First</Button>
              <Button>Second</Button>
              <Button>Third</Button>
            </ButtonGroup>
          </Card>
        </Section>

        <Spacer size="xl" />

        {/* Form Components Section */}
        <Section>
          <Heading level={2}>Form Components</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Input</Heading>
                <Spacer size="sm" />
                <Input
                  label="Name"
                  placeholder="Enter your name"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Spacer size="md" />
                <Input
                  label="Email"
                  placeholder="email@example.com"
                  helperText="We'll never share your email"
                />
                <Spacer size="md" />
                <Input
                  label="Disabled Input"
                  disabled
                  value="Cannot edit this"
                />
                <Spacer size="md" />
                <Input
                  label="Error State"
                  error="This field is required"
                  value=""
                />
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Password Input</Heading>
                <Spacer size="sm" />
                <PasswordInput
                  label="Password"
                  placeholder="Enter password"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
                
                <Spacer size="lg" />
                
                <Heading level={3}>Textarea</Heading>
                <Spacer size="sm" />
                <Textarea
                  label="Description"
                  placeholder="Enter description"
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  rows={4}
                />
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Select</Heading>
                <Spacer size="sm" />
                <Select
                  label="Country"
                  value={selectValue}
                  onChange={(value) => setSelectValue(String(value))}
                  options={[
                    { value: '', label: 'Select a country' },
                    { value: 'us', label: 'United States' },
                    { value: 'uk', label: 'United Kingdom' },
                    { value: 'ca', label: 'Canada' },
                  ]}
                />
                
                <Spacer size="lg" />
                
                <Heading level={3}>Checkbox</Heading>
                <Spacer size="sm" />
                <Checkbox
                  label="I agree to the terms and conditions"
                  checked={checkboxValue}
                  onChange={(e) => setCheckboxValue(e.target.checked)}
                />
                <Spacer size="sm" />
                <Checkbox
                  label="Disabled checkbox"
                  checked={false}
                  disabled
                />
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Toggle</Heading>
                <Spacer size="sm" />
                <Toggle
                  label="Enable notifications"
                  checked={toggleValue}
                  onChange={(checked) => setToggleValue(checked)}
                />
                <Spacer size="sm" />
                <Toggle
                  label="Disabled toggle"
                  checked={false}
                  disabled
                />
                
                <Spacer size="lg" />
                
                <Heading level={3}>Radio Group</Heading>
                <Spacer size="sm" />
                <RadioGroup
                  name="options"
                  value={radioValue}
                  onChange={(value) => setRadioValue(String(value))}
                  options={[
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                    { value: 'option3', label: 'Option 3' },
                  ]}
                />
              </Card>
            </GridItem>
          </Grid>
        </Section>

        <Spacer size="xl" />

        {/* Data Display Section */}
        <Section>
          <Heading level={2}>Data Display</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Badges</Heading>
                <Spacer size="sm" />
                <div className="showcase-row">
                  <Badge>Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                </div>
                
                <Spacer size="lg" />
                
                <Heading level={3}>Avatars</Heading>
                <Spacer size="sm" />
                <div className="showcase-row">
                  <Avatar name="John Doe" size="sm" />
                  <Avatar name="Jane Smith" size="md" />
                  <Avatar name="Bob Johnson" size="lg" />
                  <Avatar src="https://via.placeholder.com/100" alt="User" size="md" />
                </div>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>List</Heading>
                <Spacer size="sm" />
                <List>
                  <ListItem>First item</ListItem>
                  <ListItem>Second item</ListItem>
                  <ListItem>Third item</ListItem>
                </List>
                
                <Spacer size="lg" />
                
                <Heading level={3}>Tooltip</Heading>
                <Spacer size="sm" />
                <Tooltip content="This is a helpful tooltip">
                  <Button>Hover me</Button>
                </Tooltip>
              </Card>
            </GridItem>
          </Grid>
        </Section>

        <Spacer size="xl" />

        {/* Feedback Section */}
        <Section>
          <Heading level={2}>Feedback Components</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Card padding="lg">
            <Heading level={3}>Alerts</Heading>
            <Spacer size="sm" />
            <Alert variant="standard" title="Info Alert">
              This is an informational message.
            </Alert>
            <Spacer size="sm" />
            <Alert variant="filled" title="Success Alert">
              Your changes have been saved successfully!
            </Alert>
            <Spacer size="sm" />
            <Alert variant="outlined" title="Warning Alert">
              Please review your information before proceeding.
            </Alert>
            <Spacer size="sm" />
            <Alert variant="standard" title="Error Alert">
              Something went wrong. Please try again.
            </Alert>
            
            <Spacer size="xl" />
            
            <Heading level={3}>Spinners</Heading>
            <Spacer size="sm" />
            <div className="showcase-row">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="xl" />
            </div>
            
            <Spacer size="xl" />
            
            <Heading level={3}>Progress (Adaptive)</Heading>
            <Spacer size="sm" />
            <Text size="sm" color="secondary">Circular Progress</Text>
            <Spacer size="xs" />
            <div className="showcase-row">
              <Progress variant="indeterminate" color="primary" size={40} />
              <Progress variant="determinate" value={75} color="success" size={40} />
              <Progress variant="determinate" value={50} color="warning" size={40} />
            </div>
            
            <Spacer size="md" />
            <Text size="sm" color="secondary">Linear Progress</Text>
            <Spacer size="xs" />
            <Progress linear variant="indeterminate" color="primary" />
            <Spacer size="sm" />
            <Progress linear variant="determinate" value={75} color="success" />
            
            <Spacer size="xl" />
            
            <Heading level={3}>Progress Bar (Legacy)</Heading>
            <Spacer size="sm" />
            <ProgressBar value={25} max={100} />
            <Spacer size="sm" />
            <ProgressBar value={50} max={100} variant="success" />
            <Spacer size="sm" />
            <ProgressBar value={75} max={100} variant="warning" />
            <Spacer size="sm" />
            <ProgressBar value={100} max={100} variant="error" />
            
            <Spacer size="xl" />
            
            <Heading level={3}>Snackbar (Adaptive)</Heading>
            <Spacer size="sm" />
            <Button onClick={() => setSnackbarOpen(true)}>
              Show Snackbar
            </Button>
            <Snackbar
              open={snackbarOpen}
              onClose={() => setSnackbarOpen(false)}
              message="This is a snackbar notification!"
              severity="success"
              position="bottom-right"
              autoHideDuration={5000}
            />
          </Card>
        </Section>

        <Spacer size="xl" />

        {/* Layout Section */}
        <Section>
          <Heading level={2}>Layout Components</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Card padding="lg">
            <Heading level={3}>Card</Heading>
            <Spacer size="sm" />
            <Text>This is a card component with padding.</Text>
            
            <Spacer size="lg" />
            
            <Heading level={3}>Grid</Heading>
            <Spacer size="sm" />
            <Grid columns={3} gap="md">
              <GridItem>
                <Card padding="md" className="demo-card">Grid Item 1</Card>
              </GridItem>
              <GridItem>
                <Card padding="md" className="demo-card">Grid Item 2</Card>
              </GridItem>
              <GridItem>
                <Card padding="md" className="demo-card">Grid Item 3</Card>
              </GridItem>
            </Grid>
            
            <Spacer size="lg" />
          </Card>
        </Section>

        <Spacer size="xl" />

        {/* Advanced Form Components */}
        <Section>
          <Heading level={2}>Advanced Form Components</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Rating</Heading>
                <Spacer size="sm" />
                <Rating
                  value={ratingValue}
                  onChange={setRatingValue}
                  max={5}
                  showValue
                  label="Rate this product"
                />
                
                <Spacer size="lg" />
                
                <Heading level={3}>Slider</Heading>
                <Spacer size="sm" />
                <Slider
                  value={sliderValue}
                  onChange={(val) => setSliderValue(val as number)}
                  min={0}
                  max={100}
                  step={1}
                  showValue
                  label="Volume"
                />
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Date Picker</Heading>
                <Spacer size="sm" />
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={setSelectedDate}
                />
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>TextareaAutosize</Heading>
                <Spacer size="sm" />
                <TextareaAutosize
                  label="Auto-growing textarea"
                  placeholder="Type and watch it grow..."
                  minRows={2}
                  maxRows={6}
                  fullWidth
                />
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>EmailInput</Heading>
                <Spacer size="sm" />
                <EmailInput
                  label="Email Address"
                  placeholder="email@example.com"
                  fullWidth
                />
                <Spacer size="md" />
                <NumberInput
                  label="Price"
                  prefix="$"
                  allowDecimals
                  fullWidth
                />
              </Card>
            </GridItem>
          </Grid>
        </Section>

        <Spacer size="xl" />

        {/* Button Variants */}
        <Section>
          <Heading level={2}>Advanced Buttons</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Card padding="lg">
            <Heading level={3}>Toggle Button</Heading>
            <Spacer size="sm" />
            <ToggleButton
              value={toggleButtonValue}
              onChange={(val) => setToggleButtonValue(Array.isArray(val) ? val[0] || '' : val)}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
              ]}
            />
            
            <Spacer size="lg" />
            
            <Heading level={3}>Link Button</Heading>
            <Spacer size="sm" />
            <div className="showcase-row">
              <LinkButton href="#" variant="primary">Primary Link</LinkButton>
              <LinkButton href="#" variant="secondary">Secondary Link</LinkButton>
              <LinkButton href="#" external>External Link</LinkButton>
            </div>
            
            <Spacer size="lg" />
            
            <Heading level={3}>Split Button</Heading>
            <Spacer size="sm" />
            <SplitButton
              label="Save"
              actions={[
                { id: 'draft', label: 'Save as draft', onClick: () => alert('Saved as draft') },
                { id: 'publish', label: 'Save and publish', onClick: () => alert('Published') },
              ]}
            />
          </Card>
        </Section>

        <Spacer size="xl" />

        {/* Navigation Components */}
        <Section>
          <Heading level={2}>Navigation</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Breadcrumbs</Heading>
                <Spacer size="sm" />
                <Breadcrumbs
                  items={[
                    { label: 'Home', href: '/' },
                    { label: 'Products', href: '/products' },
                    { label: 'Electronics', href: '/products/electronics' },
                    { label: 'Laptop' },
                  ]}
                />
                
                <Spacer size="lg" />
                
                <Heading level={3}>Tabs</Heading>
                <Spacer size="sm" />
                <Tabs
                  value={activeTab}
                  onChange={(value) => setActiveTab(String(value))}
                  tabs={[
                    { value: 'tab1', label: 'Profile' },
                    { value: 'tab2', label: 'Settings' },
                    { value: 'tab3', label: 'Billing' },
                  ]}
                />
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Pagination</Heading>
                <Spacer size="sm" />
                <Pagination
                  currentPage={currentPage}
                  totalPages={10}
                  onPageChange={setCurrentPage}
                />
                
                <Spacer size="lg" />
                
                <Heading level={3}>Stepper</Heading>
                <Spacer size="sm" />
                <Stepper
                  steps={[
                    { id: 'account', label: 'Account' },
                    { id: 'profile', label: 'Profile' },
                    { id: 'review', label: 'Review' },
                  ]}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </Card>
            </GridItem>
          </Grid>
        </Section>

        <Spacer size="xl" />

        {/* Surface Components */}
        <Section>
          <Heading level={2}>Surfaces</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Paper</Heading>
                <Spacer size="sm" />
                <Paper elevation={2}>
                  <Text>This is a paper component with elevation</Text>
                </Paper>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Accordion</Heading>
                <Spacer size="sm" />
                <Accordion
                  items={[
                    { id: '1', title: 'Section 1', content: 'Content for section 1' },
                    { id: '2', title: 'Section 2', content: 'Content for section 2' },
                    { id: '3', title: 'Section 3', content: 'Content for section 3' },
                  ]}
                />
              </Card>
            </GridItem>
          </Grid>
        </Section>

        <Spacer size="xl" />

        {/* Data Display - Advanced */}
        <Section>
          <Heading level={2}>Advanced Data Display</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Table</Heading>
                <Spacer size="sm" />
                <Table
                  rows={[
                    { id: 1, name: 'John', email: 'john@example.com', role: 'Admin' },
                    { id: 2, name: 'Jane', email: 'jane@example.com', role: 'User' },
                    { id: 3, name: 'Bob', email: 'bob@example.com', role: 'User' },
                  ]}
                  columns={[
                    { field: 'name', headerName: 'Name' },
                    { field: 'email', headerName: 'Email' },
                    { field: 'role', headerName: 'Role' },
                  ]}
                />
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Chips & Tags</Heading>
                <Spacer size="sm" />
                <div className="showcase-row">
                  <Chip variant="primary" onDelete={() => {}}>Primary</Chip>
                  <Chip variant="success" onDelete={() => {}}>Success</Chip>
                  <Chip variant="warning">Warning</Chip>
                </div>
                <Spacer size="sm" />
                <div className="showcase-row">
                  <Tag variant="primary">Tag 1</Tag>
                  <Tag variant="default">Tag 2</Tag>
                  <Tag variant="info">Tag 3</Tag>
                </div>
                
                <Spacer size="lg" />
                
                <Heading level={3}>Timeline</Heading>
                <Spacer size="sm" />
                <Timeline
                  items={[
                    { id: '1', title: 'Order Placed', time: '2 hours ago', color: 'primary' },
                    { id: '2', title: 'Processing', time: '1 hour ago', color: 'info' },
                    { id: '3', title: 'Shipped', time: '30 min ago', color: 'success' },
                  ]}
                  position="right"
                />
              </Card>
            </GridItem>
          </Grid>
        </Section>

        <Spacer size="xl" />

        {/* Layout Components - Advanced */}
        <Section>
          <Heading level={2}>Advanced Layout</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Card padding="lg">
            <Heading level={3}>Stack</Heading>
            <Spacer size="sm" />
            <Stack direction="row" spacing="md" align="center">
              <Button>Item 1</Button>
              <Button>Item 2</Button>
              <Button>Item 3</Button>
            </Stack>
            
            <Spacer size="lg" />
            
            <Heading level={3}>Box</Heading>
            <Spacer size="sm" />
            <Box padding="md" display="flex" textAlign="center">
              <Text>Box component with custom padding and display</Text>
            </Box>
            
            <Spacer size="lg" />
            
            <Heading level={3}>Masonry</Heading>
            <Spacer size="sm" />
            <Masonry columns={3} spacing={16}>
              <Card padding="md">Item 1</Card>
              <Card padding="md">Item 2</Card>
              <Card padding="md">Item 3</Card>
              <Card padding="md">Item 4</Card>
              <Card padding="md">Item 5</Card>
              <Card padding="md">Item 6</Card>
            </Masonry>
          </Card>
        </Section>

        <Spacer size="xl" />

        {/* Feedback - Advanced */}
        <Section>
          <Heading level={2}>Advanced Feedback</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Progress Circle</Heading>
                <Spacer size="sm" />
                <div className="showcase-row">
                  <ProgressCircle value={25} size="md" />
                  <ProgressCircle value={50} size="md" color="success" />
                  <ProgressCircle value={75} size="md" color="warning" />
                  <ProgressCircle value={100} size="md" color="error" />
                </div>
                
                <Spacer size="lg" />
                
                <Heading level={3}>Skeleton Loader</Heading>
                <Spacer size="sm" />
                <SkeletonLoader variant="text" count={3} />
                <Spacer size="sm" />
                <SkeletonLoader variant="rectangular" width="100%" height="100px" />
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Empty State</Heading>
                <Spacer size="sm" />
                <EmptyState
                  icon="📭"
                  title="No items found"
                  description="Get started by creating your first item"
                  action={<Button>Create Item</Button>}
                />
              </Card>
            </GridItem>
          </Grid>
          
          <Spacer size="md" />
          
          <Card padding="lg">
            <Heading level={3}>Toast & Snackbar</Heading>
            <Spacer size="sm" />
            <div className="showcase-row">
              <Button onClick={() => setToastOpen(true)}>Show Toast</Button>
              <Button onClick={() => setSnackbarOpen(true)}>Show Snackbar</Button>
            </div>
            
            {toastOpen && (
              <Toast
                variant="success"
                message="Operation completed successfully!"
                onClose={() => setToastOpen(false)}
                position="top-right"
              />
            )}
            
            <Snackbar
              open={snackbarOpen}
              onClose={() => setSnackbarOpen(false)}
              message="This is a snackbar notification"
              position="bottom-left"
            />
          </Card>
        </Section>

        <Spacer size="xl" />

        {/* Overlay Components */}
        <Section>
          <Heading level={2}>Overlays</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Card padding="lg">
            <Heading level={3}>Modal, Dialog & SlideOver</Heading>
            <Spacer size="sm" />
            <div className="showcase-row">
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
              <Button onClick={() => setSlideOverOpen(true)}>Open SlideOver</Button>
            </div>
            
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Modal Title">
              <Text>This is a modal component with custom content.</Text>
              <Spacer size="md" />
              <Button onClick={() => setModalOpen(false)}>Close</Button>
            </Modal>
            
            <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              title="Dialog Title"
              footer={
                <>
                  <Button variant="text" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
                </>
              }
            >
              <Text>This is a dialog with a footer section.</Text>
            </Dialog>
            
            <SlideOver
              isOpen={slideOverOpen}
              onClose={() => setSlideOverOpen(false)}
              title="SlideOver Panel"
              position="right"
            >
              <Text>This is a slide-over panel that appears from the side.</Text>
            </SlideOver>
          </Card>
        </Section>

        <Spacer size="xl" />

        {/* Utility Components */}
        <Section>
          <Heading level={2}>Utility Components</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Card padding="lg">
            <Heading level={3}>Responsive Detection</Heading>
            <Spacer size="sm" />
            <Text>Is Tablet or larger: {isTablet ? 'Yes' : 'No'}</Text>
            
            <Spacer size="lg" />
            
            <Heading level={3}>TreeView</Heading>
            <Spacer size="sm" />
            <TreeView
              nodes={[
                {
                  id: '1',
                  label: 'Documents',
                  children: [
                    { id: '1-1', label: 'Work', children: [{ id: '1-1-1', label: 'Projects' }] },
                    { id: '1-2', label: 'Personal' },
                  ],
                },
                {
                  id: '2',
                  label: 'Photos',
                  children: [
                    { id: '2-1', label: 'Vacation' },
                    { id: '2-2', label: 'Family' },
                  ],
                },
              ]}
            />
          </Card>
        </Section>

        <Spacer size="xl" />
        
        {/* Adaptive Components Highlight Section */}
        <Section>
          <Heading level={2}>✨ New Adaptive Components</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Alert severity="info" title="Material-UI Integration">
            These components automatically use Material-UI when the provider is set to 'mui'. 
            Switch the provider above to see the difference!
          </Alert>
          
          <Spacer size="lg" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={4}>Modal (Adaptive)</Heading>
                <Spacer size="sm" />
                <Text size="sm" color="secondary">
                  Dialog component with customizable size and actions
                </Text>
                <Spacer size="md" />
                <Button onClick={() => setModalOpen(true)}>
                  Open Modal
                </Button>
                <Modal
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                  title="Example Modal"
                  maxWidth="sm"
                  actions={
                    <>
                      <Button variant="outlined" onClick={() => setModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="contained" onClick={() => setModalOpen(false)}>
                        Confirm
                      </Button>
                    </>
                  }
                >
                  <Text>This is a modal dialog using {provider === 'mui' ? 'Material-UI' : 'internal'} components.</Text>
                  <Spacer size="sm" />
                  <Text size="sm" color="secondary">
                    Switch the provider to see the difference in styling and behavior.
                  </Text>
                </Modal>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={4}>Alert (Adaptive)</Heading>
                <Spacer size="sm" />
                <Text size="sm" color="secondary">
                  Notification alerts with severity levels
                </Text>
                <Spacer size="md" />
                <Alert severity="success">Success message</Alert>
                <Spacer size="sm" />
                <Alert severity="error">Error message</Alert>
                <Spacer size="sm" />
                <Alert severity="warning">Warning message</Alert>
                <Spacer size="sm" />
                <Alert severity="info">Info message</Alert>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={4}>Tabs (Adaptive)</Heading>
                <Spacer size="sm" />
                <Text size="sm" color="secondary">
                  Tab navigation with horizontal/vertical orientation
                </Text>
                <Spacer size="md" />
                <Tabs
                  value={activeTab}
                  onChange={(value) => setActiveTab(value as string)}
                  tabs={[
                    { label: 'Tab 1', value: 'tab1' },
                    { label: 'Tab 2', value: 'tab2' },
                    { label: 'Tab 3', value: 'tab3' }
                  ]}
                />
                <Spacer size="md" />
                <Text>Active tab: {activeTab}</Text>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={4}>Breadcrumbs (Adaptive)</Heading>
                <Spacer size="sm" />
                <Text size="sm" color="secondary">
                  Navigation breadcrumb trail
                </Text>
                <Spacer size="md" />
                <Breadcrumbs
                  items={[
                    { label: 'Home', onClick: () => console.log('Home') },
                    { label: 'Components', onClick: () => console.log('Components') },
                    { label: 'Showcase' }
                  ]}
                />
              </Card>
            </GridItem>
          </Grid>
        </Section>
        
        <Spacer size="xl" />
      </Container>
    </div>
  );
};

export const ComponentShowcase: React.FC = ShowcaseContent;

export default ComponentShowcase;
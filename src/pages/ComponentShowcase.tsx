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
  Typography,
  // Layout
  Container,
  Grid,
  GridItem,
  Card,
  Paper,
  Accordion,
  Stack,
  Box,
  Flex,
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
  Switch,
  Toggle,
  RadioGroup,
  PasswordInput,
  EmailInput,
  NumberInput,
  DatePicker,
  Rating,
  Slider,
  Autocomplete,
  Form,
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
  Skeleton,
  LinearProgress,
  EmptyState,
  ErrorState,
  SuccessState,
  Toast,
  Snackbar,
  // Navigation
  Breadcrumbs,
  Tabs,
  Stepper,
  Pagination,
  AppBar,
  BottomNavigation,
  Menu,
  Navbar,
  DropdownMenu,
  ContextMenu,
  // Overlay
  Modal,
  Dialog,
  Drawer,
  SlideOver,
  BottomSheet,
  Popover,
  Backdrop,
  Lightbox,
  // Media
  Image,
  Carousel,
  ImageGallery,
  Thumbnail,
  // Utility
  useMediaQuery,
  Toolbar,
  SpeedDial,
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [autocompleteValue, setAutocompleteValue] = useState<{ value: string | number; label: string } | null>(null);
  const [expandedAccordion, setExpandedAccordion] = useState<string>('');
  const [bottomNavValue, setBottomNavValue] = useState('0');
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
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
                  Switch between Internal, Material-UI, and Radix UI components
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
                <Button 
                  variant={provider === 'radix' ? 'contained' : 'outlined'}
                  onClick={() => setProvider('radix')}
                  color="secondary"
                >
                  Radix UI
                </Button>
              </ButtonGroup>
            </div>
            <Spacer size="sm" />
            <Alert variant="standard">
              Current Provider: <strong>
                {provider === 'mui' && 'Material-UI (MUI)'}
                {provider === 'internal' && 'Internal Components'}
                {provider === 'radix' && 'Radix UI'}
              </strong>
              {provider === 'mui' && ' - Adaptive components now use Material-UI implementation'}
              {provider === 'radix' && ' - Adaptive components now use Radix UI implementation (NEW in v3.0.0)'}
            </Alert>
            
            <Spacer size="md" />
            <Divider />
            <Spacer size="md" />
            
            <Heading level={4}>45 Adaptive Components Available</Heading>
            <Text size="sm" color="secondary">All components below switch between providers automatically</Text>
            <Spacer size="sm" />
            <Grid columns={3} gap="sm">
              <GridItem>
                <Text size="sm" weight="semibold">Forms (8):</Text>
                <Text size="xs">Button, IconButton, Input, Select, Checkbox, Rating, Textarea, RadioGroup</Text>
              </GridItem>
              <GridItem>
                <Text size="sm" weight="semibold">Data Display (8):</Text>
                <Text size="xs">Table, TreeView, Card, Tooltip, Badge, Avatar, Chip, List</Text>
              </GridItem>
              <GridItem>
                <Text size="sm" weight="semibold">Feedback (7):</Text>
                <Text size="xs">Alert, Spinner, Slider, Switch, Progress, Skeleton, LinearProgress</Text>
              </GridItem>
              <GridItem>
                <Text size="sm" weight="semibold">Overlay (3):</Text>
                <Text size="xs">Modal, Snackbar, Drawer</Text>
              </GridItem>
              <GridItem>
                <Text size="sm" weight="semibold">Charts (3):</Text>
                <Text size="xs">LineChart, BarChart, PieChart</Text>
              </GridItem>
              <GridItem>
                <Text size="sm" weight="semibold">Navigation (6):</Text>
                <Text size="xs">Tabs, Breadcrumbs, Pagination, Stepper, Menu, BottomNavigation</Text>
              </GridItem>
              <GridItem>
                <Text size="sm" weight="semibold">Layout (5):</Text>
                <Text size="xs">Accordion, Dialog, AppBar, Divider, Popover</Text>
              </GridItem>
              <GridItem>
                <Text size="sm" weight="semibold">Buttons (3):</Text>
                <Text size="xs">ButtonGroup, ToggleButton, SpeedDial</Text>
              </GridItem>
              <GridItem>
                <Text size="sm" weight="semibold">Utility (2):</Text>
                <Text size="xs">DatePicker, Backdrop, Toolbar</Text>
              </GridItem>
            </Grid>
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

        {/* Typography Adapter Section */}
        <Section>
          <Heading level={2}>Typography Adapter (Multi-Provider)</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Card padding="lg">
            <Heading level={3}>Typography Variants</Heading>
            <Text size="sm" color="secondary">
              The Typography adapter automatically switches between internal, MUI, and Radix implementations
            </Text>
            <Spacer size="md" />
            
            <Typography variant="h1">Heading 1 Variant</Typography>
            <Typography variant="h2">Heading 2 Variant</Typography>
            <Typography variant="h3">Heading 3 Variant</Typography>
            <Typography variant="h4">Heading 4 Variant</Typography>
            <Typography variant="h5">Heading 5 Variant</Typography>
            <Typography variant="h6">Heading 6 Variant</Typography>
            
            <Spacer size="lg" />
            <Heading level={3}>Body Text Variants</Heading>
            <Spacer size="sm" />
            
            <Typography variant="body1">
              Body1: This is the default body text variant. It's used for most paragraph content
              and provides good readability for extended reading.
            </Typography>
            <Spacer size="sm" />
            
            <Typography variant="body2">
              Body2: This is a slightly smaller body text variant. It's useful for secondary
              content or when you need to fit more text in a smaller space.
            </Typography>
            <Spacer size="sm" />
            
            <Typography variant="caption">
              Caption: This variant is used for captions, footnotes, or any small supplementary text.
            </Typography>
            <Spacer size="sm" />
            
            <Typography variant="button">BUTTON TEXT VARIANT</Typography>
            <Spacer size="sm" />
            
            <Typography variant="overline">OVERLINE TEXT VARIANT</Typography>
            
            <Spacer size="lg" />
            <Heading level={3}>Color Options</Heading>
            <Spacer size="sm" />
            
            <Typography color="primary">Primary Color Typography</Typography>
            <Typography color="secondary">Secondary Color Typography</Typography>
            <Typography color="error">Error Color Typography</Typography>
            <Typography color="warning">Warning Color Typography</Typography>
            <Typography color="info">Info Color Typography</Typography>
            <Typography color="success">Success Color Typography</Typography>
            <Typography color="textPrimary">Text Primary Color</Typography>
            <Typography color="textSecondary">Text Secondary Color</Typography>
            
            <Spacer size="lg" />
            <Heading level={3}>Text Alignment</Heading>
            <Spacer size="sm" />
            
            <Typography align="left">Left aligned text (default)</Typography>
            <Typography align="center">Center aligned text</Typography>
            <Typography align="right">Right aligned text</Typography>
            <Typography align="justify">
              Justified text: Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </Typography>
            
            <Spacer size="lg" />
            <Heading level={3}>Utility Props</Heading>
            <Spacer size="sm" />
            
            <Typography gutterBottom>
              This paragraph has gutterBottom prop for spacing
            </Typography>
            <Typography gutterBottom>
              This is another paragraph with gutterBottom
            </Typography>
            <Typography>
              This is a paragraph without gutterBottom (no extra spacing below)
            </Typography>
            
            <Spacer size="md" />
            <div style={{ width: '300px', border: '1px solid #ddd', padding: '8px' }}>
              <Typography noWrap>
                This is a very long text that will be truncated with ellipsis when it overflows the container width instead of wrapping to a new line
              </Typography>
            </div>
            
            <Spacer size="lg" />
            <Heading level={3}>Practical Example</Heading>
            <Spacer size="sm" />
            
            <article style={{ maxWidth: '600px' }}>
              <Typography variant="h2" gutterBottom>
                The Power of Typography
              </Typography>
              
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Published on {new Date().toLocaleDateString()} • 5 min read
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                Typography is one of the most important aspects of design. It not only conveys 
                information but also sets the tone and mood of your content. Good typography 
                enhances readability and user experience.
              </Typography>
              
              <Typography variant="h3" gutterBottom>
                Why Typography Matters
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                Proper typography ensures that your message is communicated effectively. 
                It guides the reader's eye, establishes hierarchy, and creates visual interest.
              </Typography>
              
              <Typography variant="caption" color="textSecondary">
                * Typography best practices should be followed throughout your application
              </Typography>
            </article>
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
                <Heading level={3}>Switch</Heading>
                <Spacer size="sm" />
                <Switch
                  label="Enable notifications"
                  checked={toggleValue}
                  onChange={(checked) => setToggleValue(checked)}
                />
                <Spacer size="sm" />
                <Switch
                  label="Disabled switch"
                  checked={false}
                  disabled
                  onChange={() => {}}
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
                  <Badge><Text>Default</Text></Badge>
                  <Badge variant="standard"><Text>Standard</Text></Badge>
                  <Badge variant="dot"><Text>Dot</Text></Badge>
                </div>
                
                <Spacer size="lg" />
                
                <Heading level={3}>Avatars</Heading>
                <Spacer size="sm" />
                <div className="showcase-row">
                  <Avatar size="small">JD</Avatar>
                  <Avatar size="medium">JS</Avatar>
                  <Avatar size="large">BJ</Avatar>
                  <Avatar src="https://via.placeholder.com/100" alt="User" size="medium" />
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
                <Tooltip title="This is a helpful tooltip">
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
              <Spinner size="small" />
              <Spinner size="medium" />
              <Spinner size="large" />
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
            
            <Heading level={3}>Linear Progress (Adaptive - NEW)</Heading>
            <Text size="sm" color="secondary">New adaptive component - switches between providers</Text>
            <Spacer size="sm" />
            <Text size="xs" color="muted">Indeterminate:</Text>
            <Spacer size="xs" />
            <LinearProgress variant="indeterminate" />
            <Spacer size="md" />
            <Text size="xs" color="muted">Determinate with values:</Text>
            <Spacer size="xs" />
            <LinearProgress value={25} variant="determinate" />
            <Spacer size="sm" />
            <LinearProgress value={50} variant="determinate" color="secondary" />
            <Spacer size="sm" />
            <LinearProgress value={75} variant="determinate" />
            <Spacer size="sm" />
            <LinearProgress value={100} variant="determinate" />
            
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
            
            <Spacer size="xl" />
            
            <Heading level={3}>SkeletonLoader</Heading>
            <Text size="sm" color="secondary">Adaptive skeleton loader component</Text>
            <Spacer size="sm" />
            <SkeletonLoader variant="text" width="80%" height={20} />
            <Spacer size="xs" />
            <SkeletonLoader variant="text" width="60%" height={20} />
            <Spacer size="sm" />
            <SkeletonLoader variant="rectangular" width="100%" height={100} />
            <Spacer size="sm" />
            <SkeletonLoader variant="circular" width={60} height={60} />
            
            <Spacer size="xl" />
            
            <Heading level={3}>EmptyState</Heading>
            <Text size="sm" color="secondary">Empty state display component</Text>
            <Spacer size="sm" />
            <EmptyState
              title="No items found"
              description="There are no items to display at the moment."
              action={<Button variant="contained">Add Item</Button>}
            />
            
            <Spacer size="xl" />
            
            <Heading level={3}>ErrorState</Heading>
            <Text size="sm" color="secondary">Error state display component</Text>
            <Spacer size="sm" />
            <ErrorState
              title="Something went wrong"
              message="An error occurred while loading the data."
            />
            
            <Spacer size="xl" />
            
            <Heading level={3}>SuccessState</Heading>
            <Text size="sm" color="secondary">Success state display component</Text>
            <Spacer size="sm" />
            <SuccessState
              title="Success!"
              message="Your action was completed successfully."
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
            
            <Heading level={3}>Stack</Heading>
            <Text size="sm" color="secondary">Vertical/horizontal stack layout</Text>
            <Spacer size="sm" />
            <Stack direction="column" spacing="sm">
              <Card padding="sm" className="demo-card">Stack Item 1</Card>
              <Card padding="sm" className="demo-card">Stack Item 2</Card>
              <Card padding="sm" className="demo-card">Stack Item 3</Card>
            </Stack>
            
            <Spacer size="lg" />
            
            <Heading level={3}>Flex</Heading>
            <Text size="sm" color="secondary">Flexbox container component</Text>
            <Spacer size="sm" />
            <Flex justify="between" align="center" gap="md">
              <Card padding="md" className="demo-card">Flex 1</Card>
              <Card padding="md" className="demo-card">Flex 2</Card>
              <Card padding="md" className="demo-card">Flex 3</Card>
            </Flex>
            
            <Spacer size="lg" />
            
            <Heading level={3}>Box</Heading>
            <Text size="sm" color="secondary">Generic container with padding/margin control</Text>
            <Spacer size="sm" />
            <Box padding="lg" className="demo-card">
              <Text>Box component with padding</Text>
            </Box>
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
                <Heading level={3}>Rating (Adaptive - NEW)</Heading>
                <Text size="sm" color="secondary">New adaptive component</Text>
                <Spacer size="sm" />
                <Text size="sm">Value: {ratingValue} / 5</Text>
                <Spacer size="xs" />
                <Rating
                  value={ratingValue}
                  onChange={setRatingValue}
                  max={5}
                  precision={0.5}
                />
                <Spacer size="md" />
                <Text size="sm">Read-only:</Text>
                <Spacer size="xs" />
                <Rating
                  value={4.5}
                  max={5}
                  precision={0.5}
                  readOnly
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
            <Heading level={3}>Button Group (Adaptive - NEW)</Heading>
            <Text size="sm" color="secondary">New adaptive component - switches between providers</Text>
            <Spacer size="sm" />
            <Text size="xs" color="muted">Contained variant:</Text>
            <Spacer size="xs" />
            <ButtonGroup variant="contained" size="medium" orientation="horizontal">
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
            <Spacer size="md" />
            <Text size="xs" color="muted">Outlined variant:</Text>
            <Spacer size="xs" />
            <ButtonGroup variant="outlined" size="medium">
              <Button>Left</Button>
              <Button>Center</Button>
              <Button>Right</Button>
            </ButtonGroup>
            <Spacer size="md" />
            <Text size="xs" color="muted">Text variant:</Text>
            <Spacer size="xs" />
            <ButtonGroup variant="text" size="medium">
              <Button>Option A</Button>
              <Button>Option B</Button>
              <Button>Option C</Button>
            </ButtonGroup>
            
            <Spacer size="lg" />
            
            <Heading level={3}>Toggle Button</Heading>
            <Spacer size="sm" />
            <div className="showcase-row">
              <ToggleButton
                value="left"
                selected={toggleButtonValue === 'left'}
                onChange={() => setToggleButtonValue('left')}
              >
                Left
              </ToggleButton>
              <ToggleButton
                value="center"
                selected={toggleButtonValue === 'center'}
                onChange={() => setToggleButtonValue('center')}
              >
                Center
              </ToggleButton>
              <ToggleButton
                value="right"
                selected={toggleButtonValue === 'right'}
                onChange={() => setToggleButtonValue('right')}
              >
                Right
              </ToggleButton>
            </div>
            
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
        
        {/* Phase 4 Overlay Components */}
        <Section>
          <Heading level={2}>Phase 4 Overlay (Adaptive - NEW)</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Speed Dial</Heading>
                <Text size="sm" color="secondary">Floating action button with expandable actions</Text>
                <Spacer size="sm" />
                <div style={{ position: 'relative', height: '200px' }}>
                  <SpeedDial
                    icon={<span style={{ fontSize: '24px' }}>+</span>}
                    ariaLabel="Speed Dial Actions"
                    direction="up"
                    actions={[
                      { name: 'Copy', icon: <span>📋</span>, onClick: () => alert('Copy') },
                      { name: 'Save', icon: <span>💾</span>, onClick: () => alert('Save') },
                      { name: 'Share', icon: <span>🔗</span>, onClick: () => alert('Share') },
                    ]}
                  />
                </div>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Popover</Heading>
                <Text size="sm" color="secondary">Contextual popup anchored to element</Text>
                <Spacer size="sm" />
                <Button onClick={(e) => setPopoverAnchorEl(e.currentTarget)}>
                  Open Popover
                </Button>
                <Popover
                  open={Boolean(popoverAnchorEl)}
                  anchorEl={popoverAnchorEl}
                  onClose={() => setPopoverAnchorEl(null)}
                >
                  <div style={{ padding: '1rem' }}>
                    <Text>This is popover content</Text>
                  </div>
                </Popover>
                
                <Spacer size="lg" />
                
                <Heading level={3}>Backdrop</Heading>
                <Text size="sm" color="secondary">Overlay backdrop</Text>
                <Spacer size="sm" />
                <Button onClick={() => setBackdropOpen(true)}>
                  Show Backdrop
                </Button>
                <Backdrop
                  open={backdropOpen}
                  onClick={() => setBackdropOpen(false)}
                >
                  <Card padding="lg">
                    <Heading level={3}>Click outside to close</Heading>
                  </Card>
                </Backdrop>
              </Card>
            </GridItem>
          </Grid>
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
                  page={currentPage}
                  count={10}
                  onChange={(page) => setCurrentPage(page)}
                />
                
                <Spacer size="lg" />
                
                <Heading level={3}>Stepper</Heading>
                <Spacer size="sm" />
                <Stepper
                  steps={[
                    { label: 'Account' },
                    { label: 'Profile' },
                    { label: 'Review' },
                  ]}
                  activeStep={currentStep}
                  onStepClick={setCurrentStep}
                />
                
                <Spacer size="lg" />
                
                <Heading level={3}>Menu (Adaptive - Phase 3)</Heading>
                <Spacer size="sm" />
                <Button onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                  Open Menu
                </Button>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={() => setMenuAnchorEl(null)}
                  items={[
                    { label: 'Profile', value: 'profile' },
                    { label: 'Settings', value: 'settings' },
                    { label: 'Logout', value: 'logout' },
                  ]}
                  onItemClick={(value) => {
                    console.log('Selected:', value);
                    setMenuAnchorEl(null);
                  }}
                />
              </Card>
            </GridItem>
          </Grid>
        </Section>

        <Spacer size="xl" />
        
        {/* Phase 4 Navigation Components */}
        <Section>
          <Heading level={2}>Phase 4 Navigation (Adaptive - NEW)</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Card padding="lg">
            <Heading level={3}>Bottom Navigation</Heading>
            <Text size="sm" color="secondary">Adaptive component for mobile navigation</Text>
            <Spacer size="sm" />
            <BottomNavigation
              value={bottomNavValue}
              onChange={setBottomNavValue}
              actions={[
                { label: 'Home', value: '0' },
                { label: 'Search', value: '1' },
                { label: 'Profile', value: '2' },
              ]}
            />
            
            <Spacer size="lg" />
            
            <Heading level={3}>Toolbar</Heading>
            <Text size="sm" color="secondary">Flexible toolbar container</Text>
            <Spacer size="sm" />
            <Toolbar>
              <Button variant="text">Action 1</Button>
              <Button variant="text">Action 2</Button>
              <Button variant="contained">Primary Action</Button>
            </Toolbar>
          </Card>
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
                  <Chip label="Filled" variant="filled" onDelete={() => {}} />
                  <Chip label="Outlined" variant="outlined" onDelete={() => {}} />
                  <Chip label="Default" variant="filled" />
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
                
                <Spacer size="lg" />
                
                <Heading level={3}>Skeleton (Adaptive - NEW)</Heading>
                <Text size="sm" color="secondary">New adaptive component</Text>
                <Spacer size="sm" />
                <Skeleton variant="text" width={200} />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
                <Spacer size="sm" />
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <div style={{ flex: 1 }}>
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="60%" />
                  </div>
                </div>
                <Spacer size="sm" />
                <Skeleton variant="rectangular" width="100%" height={100} />
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
              actions={
                <>
                  <Button variant="text" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
                </>
              }
            >
              <Text>This is a dialog with action buttons.</Text>
            </Dialog>
            
            <SlideOver
              isOpen={slideOverOpen}
              onClose={() => setSlideOverOpen(false)}
              title="SlideOver Panel"
              position="right"
            >
              <Text>This is a slide-over panel that appears from the side.</Text>
            </SlideOver>
            
            <Spacer size="lg" />
            
            <Heading level={3}>BottomSheet</Heading>
            <Text size="sm" color="secondary">Mobile-style bottom drawer</Text>
            <Spacer size="sm" />
            <Button onClick={() => setBottomSheetOpen(true)}>Open BottomSheet</Button>
            <BottomSheet
              isOpen={bottomSheetOpen}
              onClose={() => setBottomSheetOpen(false)}
              title="Bottom Sheet"
            >
              <Text>This is a bottom sheet that slides up from the bottom of the screen.</Text>
              <Spacer size="md" />
              <Button onClick={() => setBottomSheetOpen(false)}>Close</Button>
            </BottomSheet>
            
            <Spacer size="lg" />
            
            <Heading level={3}>Lightbox</Heading>
            <Text size="sm" color="secondary">Image lightbox viewer</Text>
            <Spacer size="sm" />
            <Button onClick={() => setLightboxOpen(true)}>Open Lightbox</Button>
            <Lightbox
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              images={[
                { src: 'https://via.placeholder.com/800x600', alt: 'Image 1' },
                { src: 'https://via.placeholder.com/800x600/FF0000', alt: 'Image 2' },
                { src: 'https://via.placeholder.com/800x600/00FF00', alt: 'Image 3' }
              ]}
              currentIndex={0}
            />
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

        {/* New Adaptive Components Section */}
        <Section>
          <Heading level={2}>New Adaptive Components</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Autocomplete</Heading>
                <Spacer size="sm" />
                <Autocomplete
                  options={[
                    { value: 'apple', label: 'Apple' },
                    { value: 'banana', label: 'Banana' },
                    { value: 'cherry', label: 'Cherry' },
                    { value: 'date', label: 'Date' },
                    { value: 'elderberry', label: 'Elderberry' },
                  ]}
                  value={autocompleteValue}
                  onChange={setAutocompleteValue}
                  label="Select Fruit"
                  placeholder="Type to search..."
                />
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Accordion</Heading>
                <Spacer size="sm" />
                <Accordion
                  items={[
                    {
                      id: 'panel1',
                      title: 'Accordion Panel 1',
                      content: 'This is the content of panel 1. It can contain any React content.',
                    },
                    {
                      id: 'panel2',
                      title: 'Accordion Panel 2',
                      content: 'This is the content of panel 2. Click to expand/collapse.',
                    },
                    {
                      id: 'panel3',
                      title: 'Accordion Panel 3',
                      content: 'This is the content of panel 3. Smooth animations when switching providers.',
                    },
                  ]}
                  defaultExpanded={expandedAccordion}
                  onChange={(ids) => setExpandedAccordion(Array.isArray(ids) ? ids[0] || '' : ids)}
                />
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Drawer</Heading>
                <Spacer size="sm" />
                <Button onClick={() => setDrawerOpen(true)}>
                  Open Drawer
                </Button>
                <Drawer
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                  anchor="left"
                  width={300}
                >
                  <div style={{ padding: '1rem' }}>
                    <Heading level={3}>Drawer Content</Heading>
                    <Spacer size="md" />
                    <Text>This is a side drawer navigation panel.</Text>
                    <Spacer size="md" />
                    <Button onClick={() => setDrawerOpen(false)} fullWidth>
                      Close Drawer
                    </Button>
                  </div>
                </Drawer>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Menu</Heading>
                <Spacer size="sm" />
                <Button 
                  onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                >
                  Open Menu
                </Button>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={() => setMenuAnchorEl(null)}
                  items={[
                    { label: 'Profile', value: 'profile' },
                    { label: 'Settings', value: 'settings' },
                    { label: 'Logout', value: 'logout' },
                  ]}
                  onItemClick={(value) => {
                    console.log('Selected:', value);
                    setMenuAnchorEl(null);
                  }}
                />
              </Card>
            </GridItem>
          </Grid>
        </Section>
        
        {/* Latest Adaptive Components - Phase 3 */}
        <Section>
          <Heading level={2}>📦 Latest Adaptive Components (Phase 3)</Heading>
          <Text>
            Five more adaptive components with seamless provider switching.
          </Text>
          <Spacer size="lg" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Dialog</Heading>
                <Spacer size="sm" />
                <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
                <Dialog
                  open={dialogOpen}
                  onClose={() => setDialogOpen(false)}
                  title="Confirm Action"
                  maxWidth="sm"
                  actions={
                    <>
                      <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                      <Button 
                        variant="contained" 
                        onClick={() => {
                          console.log('Confirmed!');
                          setDialogOpen(false);
                        }}
                      >
                        Confirm
                      </Button>
                    </>
                  }
                >
                  <Text>Are you sure you want to proceed with this action?</Text>
                </Dialog>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>AppBar</Heading>
                <Spacer size="sm" />
                <AppBar position="static" color="primary">
                  <div style={{ padding: '1rem', color: 'white' }}>
                    <Heading level={3}>
                      My Application
                    </Heading>
                  </div>
                </AppBar>
                <Spacer size="sm" />
                <Text>App bar for navigation and branding</Text>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>List</Heading>
                <Spacer size="sm" />
                <List>
                  <ListItem>First item in the list</ListItem>
                  <ListItem>Second item in the list</ListItem>
                  <ListItem>Third item in the list</ListItem>
                  <ListItem>Fourth item in the list</ListItem>
                </List>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Divider & Textarea</Heading>
                <Spacer size="sm" />
                <Text>Section 1</Text>
                <Divider />
                <Text>Section 2</Text>
                <Divider />
                <Spacer size="sm" />
                <Textarea
                  label="Comments"
                  placeholder="Enter your comments..."
                  rows={3}
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                />
              </Card>
            </GridItem>
          </Grid>
        </Section>
        
        <Spacer size="xl" />
        
        {/* Media Components */}
        <Section>
          <Heading level={2}>Media Components</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Image</Heading>
                <Spacer size="sm" />
                <Image
                  src="https://via.placeholder.com/400x300"
                  alt="Placeholder image"
                  width={400}
                  height={300}
                />
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Thumbnail</Heading>
                <Spacer size="sm" />
                <Flex gap="sm">
                  <Thumbnail
                    src="https://via.placeholder.com/100"
                    alt="Thumbnail 1"
                    size="sm"
                  />
                  <Thumbnail
                    src="https://via.placeholder.com/100"
                    alt="Thumbnail 2"
                    size="md"
                  />
                  <Thumbnail
                    src="https://via.placeholder.com/100"
                    alt="Thumbnail 3"
                    size="lg"
                  />
                </Flex>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Carousel</Heading>
                <Spacer size="sm" />
                <Carousel autoPlay={false}>
                  <Image src="https://via.placeholder.com/400x200" alt="Slide 1" />
                  <Image src="https://via.placeholder.com/400x200/FF0000" alt="Slide 2" />
                  <Image src="https://via.placeholder.com/400x200/00FF00" alt="Slide 3" />
                </Carousel>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>ImageGallery</Heading>
                <Spacer size="sm" />
                <ImageGallery
                  images={[
                    { id: '1', src: 'https://via.placeholder.com/200', alt: 'Gallery 1' },
                    { id: '2', src: 'https://via.placeholder.com/200/FF0000', alt: 'Gallery 2' },
                    { id: '3', src: 'https://via.placeholder.com/200/00FF00', alt: 'Gallery 3' },
                    { id: '4', src: 'https://via.placeholder.com/200/0000FF', alt: 'Gallery 4' }
                  ]}
                  columns={2}
                />
              </Card>
            </GridItem>
          </Grid>
        </Section>
        
        <Spacer size="xl" />
        
        {/* Navigation Components */}
        <Section>
          <Heading level={2}>Advanced Navigation</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Navbar</Heading>
                <Spacer size="sm" />
                <Navbar>
                  <Button variant="text">Home</Button>
                  <Button variant="text">About</Button>
                  <Button variant="text">Contact</Button>
                </Navbar>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>DropdownMenu</Heading>
                <Spacer size="sm" />
                <DropdownMenu
                  trigger={<Button>Open Menu</Button>}
                  items={[
                    { id: 'profile', label: 'Profile', onClick: () => alert('Profile') },
                    { id: 'settings', label: 'Settings', onClick: () => alert('Settings') },
                    { id: 'logout', label: 'Logout', onClick: () => alert('Logout') }
                  ]}
                />
              </Card>
            </GridItem>
            
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>ContextMenu</Heading>
                <Spacer size="sm" />
                <ContextMenu
                  items={[
                    { id: 'copy', label: 'Copy', onClick: () => alert('Copy') },
                    { id: 'paste', label: 'Paste', onClick: () => alert('Paste') },
                    { id: 'delete', label: 'Delete', onClick: () => alert('Delete') }
                  ]}
                >
                  <Box padding="lg" className="demo-card">
                    <Text>Right-click here for context menu</Text>
                  </Box>
                </ContextMenu>
              </Card>
            </GridItem>
          </Grid>
        </Section>
        
        <Spacer size="xl" />
        
        {/* Form Components */}
        <Section>
          <Heading level={2}>Additional Form Components</Heading>
          <Divider />
          <Spacer size="md" />
          
          <Grid columns={2} gap="lg">
            <GridItem>
              <Card padding="lg">
                <Heading level={3}>Form</Heading>
                <Spacer size="sm" />
                <Form onSubmit={(e) => { e.preventDefault(); alert('Form submitted!'); }}>
                  <Input
                    label="Name"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Spacer size="sm" />
                  <EmailInput
                    label="Email"
                    value=""
                    onChange={() => {}}
                  />
                  <Spacer size="md" />
                  <Button type="submit" variant="contained">Submit</Button>
                </Form>
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
                  label="Dark mode"
                  checked={false}
                  onChange={() => {}}
                />
                <Spacer size="sm" />
                <Text size="sm" color="secondary">
                  Toggle is {toggleValue ? 'ON' : 'OFF'}
                </Text>
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
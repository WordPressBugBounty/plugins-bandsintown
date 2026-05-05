# Bandsintown Events Block - 2-Column Layout

## Overview
Enhanced Bandsintown Events plugin with modern WordPress 6.8 block editor support featuring a 2-column layout design.

## Features

### 2-Column Layout
- **Left Column**: Interactive navigation panel with settings categories
- **Right Column**: Wide content area with Custom HTML editor

### Settings Navigator (Left Column)
The left column provides quick access to all major settings categories:

1. **GENERAL** - Artist name, title, colors
2. **EVENTS** - Display limits, event details
3. **DATE FORMAT** - Date and time formatting options  
4. **TICKETS** - Ticket button configuration
5. **SET REMINDER** - Reminder button settings
6. **FOLLOW** - Follow artist button options
7. **REQUEST A SHOW** - Request show functionality
8. **MISCELLANEOUS** - Widget dimensions, animations, styling

### Custom HTML Area (Right Column)
- Full HTML editor with syntax highlighting
- Live preview of HTML content
- Quick action buttons:
  - **Insert Widget Code** - Generates Bandsintown widget HTML
  - **Clear HTML** - Removes all custom HTML
  - **Insert Example** - Adds a styled widget example

### Responsive Design
- Mobile-friendly layout that stacks columns on smaller screens
- Touch-friendly navigation elements
- Optimized spacing and typography

## Usage

### Block Editor
1. Add a new block and search for "Bandsintown Events"
2. Use the left navigation panel to configure settings
3. Add custom HTML in the right content area
4. Preview changes in real-time

### Quick Artist Input
- Use the "Quick Artist" field in the left panel for fast artist updates
- Status indicator shows when artist name is ready (3+ characters)

### Custom HTML Examples

#### Basic Widget
```html
<div class="bandsintown-widget" data-artist="Coldplay" data-display-limit="10"></div>
```

#### Styled Widget
```html
<style>
  .my-bandsintown {
    border: 2px solid #007cba;
    padding: 15px;
    border-radius: 8px;
  }
</style>
<div class="my-bandsintown">
  <h4>Custom Events Widget</h4>
  <div class="bandsintown-widget" data-artist="Coldplay"></div>
</div>
```

## Block Attributes

### Core Settings
- `artist` (string) - Artist name or ID
- `title` (string) - Widget title
- `showTitle` (boolean) - Display title toggle
- `displayLimit` (number) - Maximum events to show
- `backgroundColor` (string) - Background color
- `textColor` (string) - Text color
- `linkColor` (string) - Link color

### Layout Settings
- `selectedNavItem` (string) - Currently active navigation item
- `customHtml` (string) - Custom HTML content
- `widgetWidth` (string) - Widget width (auto, 300px, 400px, 500px, 100%)
- `borderRadius` (number) - Border radius in pixels

### Advanced Settings
- Event display options (artist pic, location, venue, date)
- Date/time formatting
- Button configurations (tickets, reminders, follow, request)
- Animation toggles

## Technical Details

### File Structure
```
bandsintown/
├── bandsintown.php           # Main plugin file with block registration
├── blocks/
│   ├── bandsintown-block.js  # Block editor JavaScript
│   └── bandsintown-block.css # Block styling
└── [other plugin files]
```

### WordPress Compatibility
- WordPress 6.8+
- Block API version 3
- Gutenberg editor required
- PHP 7.4+ recommended

### Block Registration
- Namespace: `bandsintown/events-block`
- Category: `widgets`
- Supports: align (wide, full), spacing (margin, padding)

## Customization

### CSS Classes
- `.bandsintown-events-block` - Main block container
- `.bandsintown-navigator` - Left column navigation
- `.bandsintown-content-area` - Right column content
- `.custom-html-content` - Custom HTML wrapper

### Hooks and Filters
The block integrates with existing Bandsintown plugin settings and can be extended through WordPress hooks.

## Installation

1. Ensure the Bandsintown plugin is installed and active
2. Add the `blocks/` directory with the JavaScript and CSS files
3. The block will automatically register and appear in the block inserter

## Browser Support
- Modern browsers with ES6 support
- Responsive design for mobile devices
- Tested with Chrome, Firefox, Safari, Edge

## Shortcode Compatibility
The block maintains full compatibility with existing `[bandsintown_events]` shortcodes and widget functionality.
<?php
// Load and decode the widget attributes JSON file
function get_widget_json_data()
{
    $json_file = plugin_dir_path(__FILE__) . 'widget-panel-config.json';

    if (!file_exists($json_file)) {
        return null;
    }

    $json_content = file_get_contents($json_file);
    return json_decode($json_content, true);
}

function get_widget_src()
{
    $data = get_widget_json_data();
    return $data['src'] ?? 'https://widgetv3.bandsintown.com/main.min.js';
}
function get_site_domain()
{
    $urlparts = parse_url(home_url());
    $domain = $urlparts['host'];
    return $domain;
}
function get_widget_app_id($artist_name = '')
{
    //js_static.parastorage.com  => Get from Wix 
    //js_widgetv3.bandsintown.com => Get from Bandsintown
    return 'js_' . get_site_domain() . ($artist_name ? '_' . preg_replace('/[^0-9]/', '', $artist_name) : '');
}
function bit_sanitize_color($color)
{
    // 3, 6, or 8 hex digits, or the empty string.
    if (preg_match('/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/', $color)) {
        return $color;
    }
    // RGB or RGBA format    
    if (preg_match('/^rgba?\(\s*(\d{1,3}\s*,\s*){2}\d{1,3}(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/', $color)) {
        return $color;
    }
    return '';
}
// Default Setting Inputs needed for the widget
function get_default_setting_inputs()
{
    $inputs = [
        'artist' => '',
        'text_color' => '#000',
        'background_color' => '#fff',
        'button_and_link_color' => '#2f95de',
        'link_text_color' => '#fff',
        'display_limit' => '15',
        'custom_css' => ''
    ];
    return $inputs;
}

// All Setting Inputs needed for the widget
function get_all_widget_setting_inputs($use_kebab = false)
{
    $wp_attributes = [];
    if ($use_kebab) {
        $data = get_widget_json_data();
        foreach ($data['attributes'] as $panel) {
            foreach ($panel['elements'] as $wp_key => $element) {
                $wp_attributes[$element['id']] = $element['default'] ?? '';
            }
        }
    } else {
        $wp_attributes = get_widget_json_wp_default_data();
    }
    return $wp_attributes;
}

// Get optional settings that are not generated dynamically
function get_enforced_attributes_widget_settings()
{
    $wp_attributes = [];
    $data = get_widget_json_data();
    foreach ($data['enforced_attributes'] as $panel_key => $value) {
        !empty($value) && $wp_attributes[$panel_key] = $value;
    }
    return $wp_attributes;
}

// Settings that are not generated dynamically
function get_none_generated_widget_settings()
{
    return [
        'div-id',
        'facebook-page-id',
        'afill-code',
        'app-id'
    ];
}

// Widget JSON Panel Attributes Processing
function get_widget_json_panel_attributes($options = [])
{
    $data = get_widget_json_data();
    foreach ($data['attributes'] as $panel_index => $panel) {
        foreach ($panel['elements'] as $wp_key => $element) {
            if (isset($options[$wp_key])) {
                $data['attributes'][$panel_index]['elements'][$wp_key]['default'] = $options[$wp_key];
            }
        }
    }
    return $data['attributes'] ?? [];
}

// Widget JSON Attributes Processing
function get_widget_json_all_attributes()
{
    $data = get_widget_json_data();
    $attributes = [];
    foreach ($data['attributes'] as $panel) {
        foreach ($panel['elements'] as $wp_key => $element) {
            $attributes[$wp_key] = $element;
        }
    }
    return $attributes;
}

// Get WP Attributes from widget JSON
function get_widget_json_wp_attributes()
{
    $data = get_widget_json_data();
    $wp_attributes = [];
    foreach ($data['attributes'] as $panel) {
        foreach ($panel['elements'] as $wp_key => $element) {
            $wp_attributes[$wp_key] = ['type' => $element['type'], 'id' => $element['id'], 'default' => $element['default']];
        }
    }
    return $wp_attributes;
}

// Get WP Default Data from widget JSON
function get_widget_json_wp_default_data()
{
    $data = get_widget_json_data();
    $wp_default_data = [];
    foreach ($data['attributes'] as $panel) {
        foreach ($panel['elements'] as $wp_key => $element) {
            !empty($element['default']) && $wp_default_data[$wp_key] = $element['default'];
        }
    }
    return $wp_default_data;
}

function get_required_shortcode_post_meta()
{
    $data = get_widget_json_data();
    $required_meta = [];
    foreach ($data['attributes'] as $panel) {
        foreach ($panel['elements'] as $wp_key => $element) {
            if (isset($element['isDynamic']) && $element['isDynamic'] === true && !empty($element['default'])) {
                $default = is_bool($element['default']) ? ($element['default'] ? 'true' : 'false') : $element['default'];
                $required_meta[$element['id']] = $default . ($element['unit'] ?? '');
            }
        }
    }
    return $required_meta;
}

// Block render callback
function drx_render_bandsintown_block($attributes, $content, $block)
{
    // Required post meta
    $post_meta = get_required_shortcode_post_meta();
    // Merge with provided attributes
    $wg_attributes = get_widget_json_all_attributes();
    foreach ($attributes as $key => $value) {
        if (isset($wg_attributes[$key])) {
            $postType = $wg_attributes[$key]['type'];
            switch ($postType) {
                case 'boolean':
                case 'checkbox':
                case 'toggle':
                    $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                    $value = $value ? 'true' : 'false';
                    break;
                case 'number':
                case 'range':
                    $value = intval($value);
                    // Special handling for display-limit: 0 means "All events" - don't clamp
                    if ($key !== 'displayLimit' || $value !== 0) {
                        if (isset($wg_attributes[$key]['min'])) {
                            $value = max($wg_attributes[$key]['min'], $value);
                        }
                        if (isset($wg_attributes[$key]['max'])) {
                            $value = min($wg_attributes[$key]['max'], $value);
                        }
                    }
                    break;
                case 'color':
                    $value = bit_sanitize_color($value);
                    break;
                default:
                    $value = sanitize_text_field($value);
            }
            $value .= $wg_attributes[$key]['unit'] ?? '';
            $post_meta[$wg_attributes[$key]['id']] = $value;
            foreach ($wg_attributes[$key]['dependencies'] ?? [] as $depKey) {
                $post_meta[$depKey] = $value;
            }
        }
    }
    // Merge with enforced_attributes
    $enforced_attributes = get_enforced_attributes_widget_settings();
    foreach ($enforced_attributes as $key => $value) {
        $post_meta[$key] = $value;
    }
    // Handled in CSS - Only effect in block editor with option Widget Width in Generals tab
    unset($post_meta['widget-width']);;
    ob_start();
?>
    <?php if (!empty($post_meta['artist-name'])): ?>
        <!-- Bandsintown Widget -->
        <script type="text/javascript" src="<?php echo esc_url(get_widget_src()); ?>"></script>
        <div class="bandsintown-widget-container" style="max-width: 100%;">
            <a class="bit-widget-initializer bandsintown-widget"
                <?php
                foreach ($post_meta as $key => $value) : ?>
                <?php
                    // Skip display-limit if value is 0 (meaning "All events")
                    // Bandsintown widget will show all events when this attribute is not set
                    if ($key === 'display-limit' && ($value === 0 || $value === '0')) {
                        continue;
                    }
                    echo "data-{$key}=\"" . esc_attr($value) . "\"\n";
                ?>
                <?php endforeach; ?>></a>
        </div>
    <?php else: ?>
        <div style="
            text-align: center;
            padding: 40px 20px;
            color: <?php echo esc_attr($tag_atts['text_color']); ?>;
            opacity: 0.7;
            font-style: italic;
        ">
            <p style="margin: 0; font-size: 16px; font-weight: 600;">
                Please specify an artist name to display events
            </p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">
                Use the block settings or enter artist name in the Quick Artist field
            </p>
        </div>
    <?php endif; ?>
<?php
    return ob_get_clean();
}

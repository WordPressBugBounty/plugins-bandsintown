<?php
/*
Plugin Name: Bandsintown Events
Plugin URI: https://wordpress.org/plugins/bandsintown/
Description: Bandsintown's Events plugin makes it easy for artists to showcase their upcoming events anywhere on their WordPress-powered blog or website. Easily display an automatically updated list of your events to your fans using the widget, shortcode or template tag.
Author: Bandsintown.com
Author URI: https://www.bandsintown.com
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Version: 1.4.1
*/

// Prevent direct access
if (!defined('ABSPATH')) {
	exit;
}

// Include helper functions
require_once dirname(__FILE__) . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'common.php';


// Bandsintown Events Plugin
class Bandsintown_JS_Plugin
{
	protected $options;
	function __construct()
	{
		if (is_admin()) {
			// disable unnecessary settings sections in admin for now
			//add_action('admin_menu', array($this, 'admin_menu'));
			//add_action('admin_init', array($this, 'plugin_admin_init'));
		} else {
			add_action('wp_enqueue_scripts', array($this, 'bandsintown_tour_dates'));
		}

		add_shortcode('bandsintown_events', array($this, 'shortcode'));
		add_action('widgets_init', array($this, 'bandsintown_widget_init'));

		$this->options = get_option('bitp_options', []);
	}

	function bandsintown_widget_init()
	{
		return register_widget('Bandsintown_JS_Widget');
	}

	function bandsintown_tour_dates()
	{
		wp_enqueue_script('bit-tour-dates', 'https://widgetv3.bandsintown.com/main.min.js');
	}

	// Admin menu management.
	function admin_menu()
	{
		add_options_page(
			'Bandsintown Events',
			'Bandsintown Events',
			'manage_options',
			'bandsintown-settings',
			array($this, 'settings')
		);
	}

	// Manage plugin settings
	function settings()
	{
?>
		<div>
			<div class="wrap" id="bandsintown_wrap">
				<h2>Bandsintown Events</h2>
				<form action="options.php" method="post">
					<?php
					settings_fields('plugin_options');
					do_settings_sections('bitp');
					?>
					<input name="Submit" type="submit" class="button-primary" tabindex="1" value="<?php esc_attr_e('Save Settings'); ?>" />
				</form>
			</div>
		</div>
<?php
	}

	// Register_settings
	function plugin_admin_init()
	{ // whitelist options
		register_setting('plugin_options', 'bitp_options', array(
			'type' => 'array',
			'sanitize_callback' => array($this, 'options_validate'),
			'default' => get_default_setting_inputs()
		));
		add_settings_section('settings_section', 'General Settings', array($this, 'main_description'), 'bitp');
		add_settings_field('artist', '', array($this, 'settings_inputs'), 'bitp', 'settings_section');
	}

	// Settings Description
	function main_description()
	{
		//
	}

	// The Settings Inputs
	function settings_inputs()
	{
		$options = get_option('bitp_options');
		$artist = esc_attr($options['artist']);
		$text_color = esc_attr($options['text_color']);
		$background_color = esc_attr($options['background_color']);
		$display_limit = esc_attr($options['display_limit']);
		$css = esc_attr($options['custom_css']);

		echo "
			<script type='text/javascript' src='https://widgetv3.bandsintown.com/main.min.js'></script>
			<tr>
			<p><label for='bitp_options[artist]'><strong>Artist</strong></label><br>
			<input id='bitp_options_artist' name='bitp_options[artist]' type='text' value='$artist' /><br>

			<p>
				You can use this section to create your own custom CSS rules and
				override the look and feel of the widget output.
			</p>

			<p>
				<strong>Text color:</strong>
				<input name='bitp_options[text_color]' tabindex='1' value='" . ($text_color ?? '#000000') . "' />
			</p>

			<p>
				<strong>Background color:</strong>
				<input name='bitp_options[background_color]' tabindex='2' value='" . ($background_color ?? '#FFFFFF') . "' />
			</p>

			<p>
				<strong>Display</strong>
				<input name='bitp_options[display_limit]' tabindex='5' value='" . ($display_limit ?? '15') . "' />
				Events
			</p>

			<p>
				<strong>Custom CSS:</strong>
				<br>
				<textarea name='bitp_options[custom_css]' style='width: 100%; height: 150px' tabindex='1'> $css </textarea>
			</p>
		";

		//render & output preview template tag
		$this->template_tag($options);
	}

	// Validation
	function options_validate($input)
	{
		$valid_input = array();
		$valid_options = shortcode_atts(get_all_widget_setting_inputs(true), get_option('bitp_options'));
		foreach ($input as $key => $value) {
			$kebab_key = str_replace('_', '-', $key);
			if (is_bool($value)) {
				$value = ($value) ? 'true' : 'false';
			}
			$input_value = $value ?: ($valid_options[$kebab_key] ?? '');
			$valid_input[$key] = sanitize_text_field($input_value);
		}
		return $valid_input;
	}

	// [bandsintown_events] shortcode
	function shortcode($atts)
	{
		$options = get_option('bitp_options');
		$widget_atts = array_merge([
			'artist-name' => htmlentities($options['artist']),
			'text-color' => esc_attr($options['text_color']),
			'background-color' => esc_attr($options['background_color']),
			'event-ticket-cta-bg-color' => esc_attr($options['button_and_link_color']),
			'sold-out-button-background-color' => esc_attr($options['button_and_link_color']),
			'display-limit' => esc_attr($options['display_limit']),
			'event-ticket-cta-text-color' => esc_attr($options['link_text_color']),
			'sold-out-button-text-color' => esc_attr($options['link_text_color']),
			'event-rsvp-cta-border-color' => esc_attr($options['button_and_link_color']),
			'event-rsvp-cta-text-color' => esc_attr($options['button_and_link_color'])
		], $atts);
		$output = $this->template_tag($widget_atts, false);
		return $output;
	}

	// actual processing of the template tag
	function template_tag($params = array(), $echo = true)
	{
		if (!is_array($params)) {
			$str = $params;
			$params = array();
			parse_str($str, $params);
		}
		if (empty($params['artist-name']) && !empty($this->options['artist'])) {
			$params['artist-name'] = $this->options['artist'];
		}
		//fill in any missing values from the settings
		$default_atts = get_required_shortcode_post_meta();
		$default_atts['event-rsvp-only-show-icon'] = 'false'; // default to false for backwards compatibility
		//$default_atts = get_all_widget_setting_inputs(true);
		$widget_atts = array_merge($default_atts, $params);
		//$widget_atts = shortcode_atts($default_atts, $params);
		$enforced_attributes = get_enforced_attributes_widget_settings();
		// Merge with enforced_attributes
		foreach ($enforced_attributes as $key => $value) {
			$widget_atts[$key] = $value;
		}
		$output = '<div class="bandsintown-widget-container" style="max-width: 100%;">';
		$output .= " <a class='bit-widget-initializer' ";
		foreach ($widget_atts as $key => $value) {
			//$value = $tag_atts[$key] ?? $value;
			// Skip display-limit if value is 0 (meaning "All events")
			// Bandsintown widget will show all events when this attribute is not set
			if ($key === 'display-limit' && ($value === 0 || $value === '0')) {
				continue; // Skip this attribute
			}
			$output .= "
				data-" . $key . "='" . esc_attr($value) . "'";
		}
		$output .= " ></a></div>";

		$options = get_option('bitp_options');

		if (!empty($options['custom_css'])) {
			$output .= '<style type="text/css">' . esc_html($options['custom_css']) . '</style>';
		}
		if ($echo) {
			echo $output;
		} else {
			return $output;
		}
	}
} // end Bandsintown_JS_Plugin

//
// Bandsintown Widget
//
class Bandsintown_JS_Widget extends WP_Widget
{

	function __construct()
	{
		parent::__construct(false, $name = 'Bandsintown Events');
	}

	function widget($args, $instance)
	{
		extract($args);
		$title = apply_filters('widget_title', $instance['title']);
		echo $before_widget;
		if ($title)
			echo $before_title . $title . $after_title;
		the_bandsintown_events(array(
			'artist' => $instance['artist'],
			'display_limit' => $instance['display_limit'],
			'force_narrow_layout' => true
		));

		echo $after_widget;
	}

	function update($new_instance, $old_instance)
	{
		$instance = $new_instance;
		$instance['title'] = strip_tags($new_instance['title']);
		$instance['artist'] = strip_tags(stripslashes($new_instance['artist']));
		$instance['display_limit'] = strip_tags(stripslashes($new_instance['display_limit']));
		return $instance;
	}

	function form($instance)
	{
		if (empty($instance['artist'])) {
			$options = get_option('bitp_options');
			$instance['artist'] = $options['artist'];
		}
		include dirname(__FILE__) . DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR . 'widget-form.php';
	}
} // end Bandsintown JS Widget


// Block Editor Support
function bandsintown_register_block()
{
	// Check if block editor is available
	if (!function_exists('register_block_type')) {
		return;
	}

	// Register the block script
	wp_register_script(
		'bandsintown-block-editor',
		plugins_url('blocks/bandsintown-block.js', __FILE__),
		array('wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'),
		filemtime(plugin_dir_path(__FILE__) . 'blocks/bandsintown-block.js'),
		false
	);

	// Register the block styles
	wp_register_style(
		'bandsintown-block-style',
		plugins_url('blocks/bandsintown-block.css', __FILE__),
		array(),
		filemtime(plugin_dir_path(__FILE__) . 'blocks/bandsintown-block.css')
	);

	// Enqueue block styles for both editor and frontend
	wp_enqueue_style('bandsintown-block-style');

	// Get default settings
	$options = get_option('bitp_options', []);

	$options = array_merge(array(
		'artist' => '',
		'text_color' => '#000',
		'background_color' => '#fff',
		'display_limit' => '15',
		'custom_css' => ''
	), $options);


	// Localize default settings for JavaScript
	wp_localize_script('bandsintown-block-editor', 'bandsintownBlock', array(
		'defaultSettings' => array(
			'artist' => '', //$options['artist']
			'textColor' => $options['text_color'],
			'backgroundColor' => $options['background_color'],
			'displayLimit' => intval($options['display_limit']),
			'customCSS' => $options['custom_css']
		),
		'defaultPanelAttributes' => get_widget_json_panel_attributes($options),
		'defaultWPAttributes' => get_widget_json_wp_default_data(),
		'widgetAttributes' => get_widget_json_all_attributes(),
		'requiredShortcodePostMeta' => get_required_shortcode_post_meta(),
		'enforcedAttributes' => get_enforced_attributes_widget_settings(),
		'widgetSrc' => get_widget_src(),
		'pluginUrl' => plugins_url('', __FILE__),
		'iconUrl' => plugins_url('favicon.png', __FILE__),
	));

	// Register the block type
	register_block_type('bandsintown/events-block', array(
		'editor_script' => 'bandsintown-block-editor',
		'editor_style' => 'bandsintown-block-style',
		'style' => 'bandsintown-block-style',
		'render_callback' => 'drx_render_bandsintown_block',
		//'attributes' => get_option('bitp_options', [])
	));
}

// Hook into init to register block
add_action('init', 'bandsintown_register_block');

global $bitp;
$bitp = new Bandsintown_JS_Plugin();

// template tag wrapper
function the_bandsintown_events($params = array(), $echo = true)
{
	global $bitp;
	return $bitp->template_tag($params, $echo);
}

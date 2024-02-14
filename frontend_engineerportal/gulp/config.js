var src_fed = './src/',
	dest_base = './dist/',
	temp_base = './temp/';

var bundleHash = new Date().getTime();

module.exports = {
	sass: {
		src: [
			src_fed + 'assets/sass/*.sass',
			src_fed + 'app/**/*.sass'
		],
		dest: temp_base + 'styles/'
	},
	copy: {
		libs: {
			src: [
			],
			dest: dest_base + 'node_modules',
			cwd: 'node_modules/**'
		},
		assets: {
			src: [
				'app/**/*.json',
				'app/**/*.jpg',
				'app/**/*.png',
				'app/**/*.svg',
				'app/**/*.txt'
			],
			dest: dest_base
		},
		html: {
			src: [
				'app/**/*.html'
			],
			dest: dest_base
		},
		favicon: {
			src: ['./favicon.ico'],
			dest: './dist'
		},
		static: {
			src: [],
			dest: './dist'
		}
	},
	bundlejs: {
		js: {
			src: [
				'./app/scripts/main.js'
			],
			output: 'main.min.js',
			dest: 'dist/scripts'
		},
		css: {
			src: [
				'./temp/styles/**/*.css',
				'./temp/styles/*.css'
			],
			output: 'main.min.css',
			dest: 'dist/styles'
		}

	},
	watch: {
		sass: {
			src: src_fed + 'sass/**/*.sass',
			tasks: ['compile:sass']
		}
	},
	html_replace: {
		fed_app: {
			src: 'app/**/*.html',
			bundle_name: {
				'app': bundleHash + '.app.bundle.js',
				'css': '.min.main.css'
			},
			dest: dest_base
		}
	},
	clean: {
		fed_all: {
			src: ['dist']
		},
		temp: {
			src: ['temp']
		}
	},
	pagespeed: {
		urldetails: {
			url: 'https://www.google.co.in/',
			strategy: 'mobile'
		}
	},
	html: {
		src: [
			'app/**/*.html'
		],
		dest: dest_base
	}
};

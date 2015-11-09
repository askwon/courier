function extensionImageExists(ext) {
	var extensions = [
		"3dm",
		"3ds",
		"3g2",
		"3gp",
		"7z",
		"aac",
		"ai",
		"aif",
		"apk",
		"app",
		"asf",
		"asp",
		"aspx",
		"asx",
		"avi",
		"bak",
		"bat",
		"bin",
		"bmp",
		"cab",
		"cad",
		"cdr",
		"cer",
		"cfg",
		"cfm",
		"cgi",
		"class",
		"com",
		"cpl",
		"cpp",
		"crx",
		"csr",
		"css",
		"csv",
		"cue",
		"cur",
		"dat",
		"db",
		"dbf",
		"dds",
		"dem",
		"dir",
		"dll",
		"dmg",
		"dmp",
		"doc",
		"docx",
		"drv",
		"dtd",
		"dwg",
		"dxf",
		"elf",
		"eps",
		"exe",
		"fla",
		"flash",
		"flv",
		"fnt",
		"fon",
		"gam",
		"gbr",
		"ged",
		"gif",
		"gpx",
		"gz",
		"gzip",
		"hqz",
		"html",
		"ibooks",
		"icns",
		"ico",
		"ics",
		"idk",
		"iff",
		"indd",
		"iso",
		"jar",
		"jpeg",
		"jpg",
		"js",
		"jsp",
		"key",
		"kml",
		"kmz",
		"license",
		"lnk",
		"log",
		"lua",
		"m3u",
		"m4a",
		"m4v",
		"macho",
		"max",
		"mdb",
		"mdf",
		"mid",
		"mim",
		"mov",
		"mp3",
		"mp4",
		"mpa",
		"mpg",
		"msg",
		"msi",
		"nes",
		"obj",
		"odb",
		"odc",
		"odf",
		"odg",
		"odi",
		"odp",
		"ods",
		"odt",
		"odx",
		"ogg",
		"otf",
		"pages",
		"pct",
		"pdb",
		"pdf",
		"pif",
		"pkg",
		"pl",
		"png",
		"pps",
		"ppt",
		"pptx",
		"ps",
		"psd",
		"pub",
		"py",
		"ra",
		"rar",
		"raw",
		"rm",
		"rom",
		"rpm",
		"rss",
		"rtf",
		"sav",
		"sdf",
		"sitx",
		"sql",
		"srt",
		"svg",
		"swf",
		"sys",
		"tar",
		"tex",
		"tga",
		"thm",
		"tiff",
		"tmp",
		"torrent",
		"ttf",
		"txt",
		"uue",
		"vb",
		"vcd",
		"vcf",
		"vob",
		"wav",
		"wma",
		"wmv",
		"wpd",
		"wps",
		"wsf",
		"xhtml",
		"xlr",
		"xls",
		"xlsx",
		"xml",
		"yuv",
		"zip"
	];
	return (extensions.indexOf(ext) > -1);
}
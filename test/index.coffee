chai = require 'chai'
global.expect = chai.expect

require './requireFinder_spec'
require './fileFinder_spec'
require './sourceFileAnalyzer_spec'
require './fileLocationCalculator_spec'
require './changedRequiresByFile_spec'

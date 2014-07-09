# Angular + Elasticsearch Example

This is a very simple project designed to help people get going with angular and elasticsearch. It installs `angular` and `elasticsearch.js` via bower, and then combines them to print out some server information.

## Prerequisites

In order to run this example, you will need to have the following installed
  1. [elasticsearch](http://www.elasticsearch.org/guide/en/elasticsearch/guide/current/_installing_elasticsearch.html)
  2. [node.js](http://nodejs.org/)
  3. [bower](http://bower.io/#install-bower)

## To get the example running:

1. Clone this repo locally (or just download and unzip it)

  ```sh
  git clone https://github.com/spenceralger/elasticsearch-angular-example.git
  ```

2. Move into the new repo

  ```sh
  cd elasticsearch-angular-example
  ```

3. Install the bower dependencies

  ```sh
  bower install
  ```

4. Open the index.html file in your browser.
5. Check out the source for index.html to see how we tie together the `esFactory` and angular.
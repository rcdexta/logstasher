# Logstasher

A dashboard specifically developed to monitor/analyse logs. This is powered by logstash/elasticsearch

## Prerequisites

In order to run this example, you will need to have the following installed
  1. [elasticsearch](http://www.elasticsearch.org/guide/en/elasticsearch/guide/current/_installing_elasticsearch.html)
  2. [bower](http://bower.io/#install-bower)

You will also need to configure elasticsearch to accept requests from the browser using [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing). To enable CORS, add the following to elasticsearch's config file. Usually, this file is located near the elasticsearch executable at `config/elasticsearch.yml`.

```yml
http.cors:
  enabled: true
  allow-origin: /https?:\/\/localhost(:[0-9]+)?/
```

## To run the example:
1. Clone this repo locally (or just download and unzip it)

  ```sh
  git clone https://github.com/rcdexta/logstasher
  ```

2. Move into the project

  ```sh
  cd logstasher
  ```

3. Install the bower dependencies

  ```sh
  bower install
  ```

4. Open the index.html file in your browser.
5. Check out the source for [index.html](https://github.com/rcdexta/logstasher/blob/master/index.html) to see how it works.

## Deployment

To deploy to production or staging, verify the configuration in `src/config` and run

``` sh
sh deploy-staging.sh
sh deploy-prod.sh
```
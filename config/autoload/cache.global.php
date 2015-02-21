<?php
return array(
    'caches' => array(
        'memcached' => array( //can be called directly via SM in the name of 'memcached'
            'adapter' => array(
                'name'     =>'memcached',
                'lifetime' => 7200,
                'options'  => array(
                    'servers'   => array(
                        array(
                            '127.0.0.1',11211
                        )
                    ),
                    'namespace'  => 'memcachepueblapictures',
                    'liboptions' => array (
                        'COMPRESSION' => true,
                        'binary_protocol' => true,
                        'no_block' => true,
                        'connect_timeout' => 100
                    )
                )
            ),
            'plugins' => array(
                'exception_handler' => array(
                    'throw_exceptions' => false
                ),
                'serializer',
            ),
        ), //memcached
        
        'filesystem' => array(
                        'adapter' => array(
                            'name' => 'filesystem',
                            'options' => array(
                                'cache_dir' => 'data/cache',
                                'ttl' => '604800',
                            ),
                        ),
                        'plugins' => array(
                            'exception_handler' => array('throw_exceptions' => false),
                            'serializer',
                        ),
                    ),
        
        'cache-apc' => array(
            'adapter' => array(
                'name' => 'apc',
                'options' => array(
                    'ttl'       => 7200,
                    'namespace' => 'zfcachepuepic',
                ),
                'plugins' => array(
                    'exception_handler' => array('throw_exceptions' => false),
                    'serializer'
                ),
                
            ),
        ),
    ),
);
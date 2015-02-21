<?php
use Application\Controller\IndexController;
use Zend\Test\PHPUnit\Controller\AbstractHttpControllerTestCase;

class IndexControllerTest extends AbstractHttpControllerTestCase
{
    private $indexController;
    private $externalSites;
    
    protected function setUp()
    {
        parent::setUp();
        
        $this->setApplicationConfig(
            include '/paginas/pueblapictures.com/config/application.config.php'
        );
        
        $this->externalSites = include '/paginas/pueblapictures.com/config/autoload/externalsites.global.php';
        //$this->IndexController = new IndexController();
    }
    
    public function testExternalSites()
    {
        $externalSites = $this->externalSites;
        $this->assertArrayHasKey('external_sites', $externalSites);
    }
}
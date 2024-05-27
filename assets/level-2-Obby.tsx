<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.10.2" name="level-2-Obby" tilewidth="128" tileheight="128" tilecount="121" columns="11">
 <image source="spritesheet_retina.png" width="1408" height="1408"/>
 <tile id="76">
  <properties>
   <property name="death" type="bool" value="true"/>
  </properties>
  <animation>
   <frame tileid="76" duration="500"/>
   <frame tileid="96" duration="500"/>
  </animation>
 </tile>
 <tile id="91">
  <properties>
   <property name="collect" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="93">
  <properties>
   <property name="nextLevel" type="bool" value="true"/>
  </properties>
 </tile>
</tileset>

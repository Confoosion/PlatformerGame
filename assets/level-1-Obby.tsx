<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.10.2" name="level-1-Obby" tilewidth="128" tileheight="128" tilecount="121" columns="11">
 <image source="spritesheet_retina.png" width="1408" height="1408"/>
 <tile id="76">
  <objectgroup draworder="index" id="3">
   <object id="2" x="62.6024" y="3.3491">
    <polygon points="0,0 -59.5109,60.2838 -0.257623,123.401 63.6329,61.5719"/>
   </object>
  </objectgroup>
  <animation>
   <frame tileid="76" duration="500"/>
   <frame tileid="96" duration="500"/>
  </animation>
 </tile>
 <tile id="91">
  <properties>
   <property name="collect" type="bool" value="true"/>
  </properties>
  <objectgroup draworder="index" id="2">
   <object id="1" x="46.6298" y="38.3858">
    <polygon points="0,0 -18.5489,17.776 17.5184,56.4194 53.8432,20.8675 34.2639,-0.772869"/>
   </object>
  </objectgroup>
 </tile>
 <tile id="93">
  <properties>
   <property name="nextLevel" type="bool" value="true"/>
  </properties>
 </tile>
</tileset>

<template>
  <div class="main">
    <div id="cesium-container" ref="cesiumContainer"></div>

    <!-- 测试 -->
    <div class="control-panel">
      <div class="button-group">
        <div class="vr-btn" @click="addRedMarker">红色标点</div>
        <div class="vr-btn bay-btn" @click="addGreenMarker">绿色标点</div>
        <div class="vr-btn bay-btn" @click="addYellowMarker">黄色标点</div>
        <div class="vr-btn" @click="clearAllMarkers">清除标点</div>
      </div>
    </div>

    <!-- 弹出层 -->
    <div
      v-if="popupVisible"
      class="marker-popup"
      :class="popupColorClass"
      :style="{ left: popupPosition.x + 'px', top: popupPosition.y + 'px' }"
    >
      <ul>
        <li>点位类别：自动点位</li>
        <li>编码：FBDY3</li>
        <li>点位名称：大亚湾东山</li>
        <li>状态：一类(2025-01-16 14时)</li>
      </ul>
      <div class="btn">2项告警未处理</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed, nextTick} from "vue";
import { ElMessage } from "element-plus";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1YWUxYzYyOS01NTczLTQ5MmMtOGNmNS1mODg5MzJkN2I0OWUiLCJpZCI6MzA3NzAzLCJpYXQiOjE3NDg1NzQ5NzB9.LUkugDrB3RgfenlB85WkX2mJ2wPCh0JT8TBxEeBJIIU";

// 定义标点颜色类型
type MarkerColor = 'red' | 'green' | 'yellow';

// 定义标点信息接口
interface MarkerInfo {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  color: MarkerColor;
  createTime: string;
  entity: Cesium.Entity;
}

const cesiumContainer = ref<HTMLElement | null>(null);
let viewer: Cesium.Viewer | null = null;
// 存储所有标点的集合，方便后续管理
let markerEntities: Cesium.Entity[] = [];
// 存储标点信息的映射
const markerInfoMap = new Map<string, MarkerInfo>();

// 弹出层相关状态
const popupVisible = ref(false);
const popupPosition = ref({ x: -9999, y: -9999 }); // 初始位置设置为屏幕外，避免闪烁
const selectedMarker = ref<MarkerInfo | null>(null);

// 计算弹窗颜色类
const popupColorClass = computed(() => {
  if (!selectedMarker.value) return 'popup-red';

  switch (selectedMarker.value.color) {
    case 'red': return 'popup-red';
    case 'green': return 'popup-green';
    case 'yellow': return 'popup-yellow';
    default: return 'popup-red';
  }
});

// 更新弹出层位置的函数
const updatePopupPosition = () => {
  if (!viewer || !selectedMarker.value || !popupVisible.value) return;

  const markerInfo = selectedMarker.value;
  const position = Cesium.Cartesian3.fromDegrees(markerInfo.longitude, markerInfo.latitude);
  const canvasPosition = viewer.scene.cartesianToCanvasCoordinates(position, new Cesium.Cartesian2());

  if (canvasPosition) {
    popupPosition.value = {
      x: canvasPosition.x, // 不需要偏移，因为CSS transform会处理居中
      y: canvasPosition.y - 20 // 向上偏移一点，避免与标点重叠
    };
  }
};

/**
 * 在地图上添加带有涟漪动画效果的标点
 * @param longitude 经度
 * @param latitude 纬度
 * @param color 标点颜色，支持 'red', 'green', 'yellow'
 * @param name 标点名称（可选）
 * @returns 创建的标点实体
 */
 const addMapMarker = (
  longitude: number,
  latitude: number,
  color: MarkerColor,
  name?: string,
): Cesium.Entity | null => {
  if (!viewer) return null;
  viewer.scene.postProcessStages.fxaa.enabled = false;

  // 生成唯一ID
  const markerId = `marker_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  // 中心点 - 使用点而不是billboard，确保可见和可点击
  const centerPoint = viewer.entities.add({
    id: markerId,
    name: name || `标点`,
    position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
    point: {
      pixelSize: 40,
      color: getCesiumColor(color).color,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY, // 不被地形遮挡
      scaleByDistance: new Cesium.NearFarScalar(
        100, 1.0,
        2000, 0.3
      ),
    },
    // label: {
    //    show:true,
    //     showBackground:true,
    //     backgroundColor:Cesium.Color.fromCssColorString('#000'),
    //     scale: 0.5,
    //     font:'normal 32px MicroSoft YaHei',
    //     text:`测试标点`,
    //     verticalOrigin: Cesium.VerticalOrigin.TOP,
    //     pixelOffset :new Cesium.Cartesian2(0, -40),
    //     horizontalOrigin:Cesium.HorizontalOrigin.LEFT
    // }
  });
  markerEntities.push(centerPoint);

  // 存储标点信息
  const markerInfo: MarkerInfo = {
    id: markerId,
    name: name || `标点`,
    longitude,
    latitude,
    color,
    createTime: new Date().toLocaleString(),
    entity: centerPoint
  };
  markerInfoMap.set(markerId, markerInfo);

  // 波纹动画
  const waveCount = 3; // 波纹数量
  const duration = 2000; // 每个波纹动画时长(ms)
  for (let i = 0; i < waveCount; i++) {
    const startTime = Date.now() + (i * duration) / waveCount;
    
    const R1 = () => {
      const t = ((Date.now() - startTime) % duration) / duration;
      const value = 1 + t * 50;
      return value;
    };
    const R2 = () => {
      const t = ((Date.now() - startTime) % duration) / duration;
      const value = 0 + t * 50;
      return value;
    };
    const waveEntity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
      ellipse: {
        semiMajorAxis: new Cesium.CallbackProperty(R1, false),
        semiMinorAxis: new Cesium.CallbackProperty(R2, false),
        material: new Cesium.ColorMaterialProperty(
          new Cesium.CallbackProperty(() => {
            const t = ((Date.now() - startTime) % duration) / duration;
            return getCesiumColor(color).color.withAlpha(1 - t);
          }, false)
        ),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        height: 0,
        outline: false,
      }
    });
    markerEntities.push(waveEntity);
  }

  return centerPoint;
};
const getCesiumColor = (color: MarkerColor): any => {
  switch (color) {
    case 'red': return {
      color: Cesium.Color.fromCssColorString('#FF0000'),
      size: 30
    };
    case 'green': return {
      color: Cesium.Color.fromCssColorString('#0db35f'),
      size: 20
    };
    case 'yellow': return {
      color: Cesium.Color.fromCssColorString('#eb9d0c'),
      size: 10
    };
    default: return {
      color: Cesium.Color.WHITE,
      size: 10
    };
  }
};

/**
 * 清除所有标点
 */
const clearAllMarkers = () => {
  if (!viewer) return;

  // 移除所有标点实体
  markerEntities.forEach(entity => {
    viewer?.entities.remove(entity);
  });

  // 清空集合
  markerEntities = [];
  // 清空标点信息映射
  markerInfoMap.clear();
  // 关闭弹出层
  closePopup();
};

/**
 * 根据实体ID移除特定标点
 * @param entityId 要移除的实体ID
 */
const removeMarkerById = (entityId: string) => {
  if (!viewer) return;

  const entity = viewer.entities.getById(entityId);
  if (entity) {
    viewer.entities.remove(entity);
    markerEntities = markerEntities.filter(e => e.id !== entityId);
    // 从标点信息映射中移除
    markerInfoMap.delete(entityId);
    // 如果删除的是当前选中的标点，关闭弹出层
    if (selectedMarker.value?.id === entityId) {
      closePopup();
    }
  }
};

onMounted(async () => {
  // 初始化Cesium Viewer
  viewer = new Cesium.Viewer("cesium-container", {
    terrainProvider: await Cesium.createWorldTerrainAsync(), // 使用Cesium世界地形
    baseLayerPicker: false, // 禁用基础图层选择器
    animation: false, // 禁用动画控件
    timeline: false, // 禁用时间线
    sceneModePicker: false, // 禁用场景模式选择器
    navigationHelpButton: false, // 禁用导航帮助按钮
    fullscreenButton: false, // 禁用全屏按钮
    vrButton: false, // 禁用VR按钮
    homeButton: false, // 禁用主页按钮
    geocoder: false, // 禁用地理编码器
    infoBox: false, // 禁用信息框
    selectionIndicator: false, // 禁用选择指示器
    shouldAnimate: true, // 启用动画，这对于涟漪效果很重要
  });
  // 设置初始化视角
  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(113.3211, 23.1066, 1500), // 广州塔位置
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90), 
      roll: 0.0,
    },
  });
  // 启用深度检测以实现三维地形效果
  // viewer.scene.globe.depthTestAgainstTerrain = true;
  
  // 启用基于太阳位置的照明
  viewer.scene.globe.enableLighting = true;

  // 添加天地图注记层
  const tdtAnnotation = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t2.tianditu.gov.cn/cia_w/wmts?tk=934b0924c010faa1467bb73517ba38bd",
    layer: "cia",
    style: "default",
    format: "tiles",
    tileMatrixSetID: "w",
    maximumLevel: 18,
    credit: new Cesium.Credit("天地图全球注记服务"),
  });
  viewer.imageryLayers.addImageryProvider(tdtAnnotation);

  // 添加点击事件监听器
  viewer.cesiumWidget.screenSpaceEventHandler.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
    const pickedObject = viewer?.scene.pick(event.position);
    if (pickedObject && pickedObject.id) {
      const entityId = pickedObject.id.id;
      const markerInfo = markerInfoMap.get(entityId);
      console.log('点击的Marker信息:', pickedObject,entityId,markerInfoMap);

      if (markerInfo) {
        showPopup(event.position, markerInfo);
      }
    } else {
      // 点击空白处关闭弹出层
      closePopup();
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // 添加地图移动时更新弹窗位置的监听器
  viewer.scene.postRender.addEventListener(updatePopupPosition);
});

onUnmounted(() => {
  // 清除所有标点
  clearAllMarkers();
  // 移除事件监听器
  if (viewer) {
    viewer.scene.postRender.removeEventListener(updatePopupPosition);
    viewer.destroy();
  }
});

// 添加不同颜色和波纹样式的标点
const addRedMarker = () => {
  const longitude = 113.3211 + (Math.random() - 0.5) * 0.01;
  const latitude = 23.1066 + (Math.random() - 0.5) * 0.01;
  const marker = addMapMarker(longitude, latitude, 'red', '红色警报点');
  if (marker) {
    ElMessage.success('已添加红色标点');
  }
};

const addGreenMarker = () => {
  const longitude = 113.3211 + (Math.random() - 0.5) * 0.01;
  const latitude = 23.1066 + (Math.random() - 0.5) * 0.01;
  const marker = addMapMarker(longitude, latitude, 'green', '绿色安全点');
  if (marker) {
    ElMessage.success('已添加绿色标点');
  }
};

const addYellowMarker = () => {
  const longitude = 113.3211 + (Math.random() - 0.5) * 0.01;
  const latitude = 23.1066 + (Math.random() - 0.5) * 0.01;
  const marker = addMapMarker(longitude, latitude, 'yellow', '黄色警告点');
  if (marker) {
    ElMessage.success('已添加黄色标点');
  }
};
// 弹出层相关方法
/**
 * 关闭弹出层
 */
const closePopup = () => {
  popupVisible.value = false;
  selectedMarker.value = null;
};

/**
 * 显示弹出层
 * @param _screenPosition 屏幕坐标
 * @param markerInfo 标点信息
 */
const showPopup = async (_screenPosition: Cesium.Cartesian2, markerInfo: MarkerInfo) => {
  selectedMarker.value = markerInfo;

  // 先计算并设置位置
  const position = Cesium.Cartesian3.fromDegrees(markerInfo.longitude, markerInfo.latitude);
  const canvasPosition = viewer?.scene.cartesianToCanvasCoordinates(position, new Cesium.Cartesian2());

  if (canvasPosition) {
    popupPosition.value = {
      x: canvasPosition.x,
      y: canvasPosition.y - 20
    };
  }

  // 等待下一个 tick 确保位置已经设置，然后显示弹窗
  await nextTick();
  popupVisible.value = true;
};

// 暴露方法
defineExpose({
  addMapMarker,
  clearAllMarkers,
  removeMarkerById,
  addRedMarker,
  addGreenMarker,
  addYellowMarker
});

</script>

<style lang="scss" scoped>
// @use "../styles/init.scss" as *;
:deep(.cesium-credit-wrapper) {
  display: none !important;
}

.main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;

  #cesium-container {
    width: 100%;
    height: 100%;
  }
  
  .control-panel {
    position: absolute;
    bottom: 3.5vh;
    right: 50%;
    transform: translateX(50%);
    z-index: 1;
    // padding: vw(15);
    border-radius: vw(8);

    .button-group {
      display: flex;
      // flex-direction: column;
      gap: vw(16);
      .el-button{
        margin: 0;
        font-size: vw(14);
        background: #00000062;
        color: #fff;
      }
    }
  }

  // 弹出层样式
  .marker-popup {
    position: absolute;
    z-index: 1;
    border-radius: vw(8);
    min-width: vw(340);
    padding: vw(10) vw(15);
    color: #ffffff;
    backdrop-filter: blur(vw(10));
    font-size: vw(14);
    box-shadow: 0 vw(4) vw(20) rgba(0, 0, 0, 0.3);
    transform: translate(-50%, -100%);
    pointer-events: auto;
    ul{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: vw(10);
      margin-bottom: vh(10);
    }
    .btn{
      width: fit-content;
      padding: vw(8) vw(14);
      color: #fff;
      border-radius: vw(5);
      font-size: vw(12);
      cursor: pointer;
      &:hover{
        opacity: .8;
      }
    }

    // 红色主题
    &.popup-red {
      background: rgba(255, 51, 51, 0.314);
      border: vw(1) solid rgb(243, 32, 32);

      .btn {
        background: #eb0c0c;
      }
    }

    // 绿色主题
    &.popup-green {
      background: #0db35f50;
      border: vw(1) solid #0db35f;

      .btn {
        background: #0db35f;
      }
    }

    // 黄色主题
    &.popup-yellow {
      background: #eb9d0c4a;
      border: vw(1) solid #eb9d0c;

      .btn {
        background: #eb9d0c;
      }
    }
  }
}
</style>

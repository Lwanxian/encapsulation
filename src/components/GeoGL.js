import * as THREE from "three/build/three.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let GeoGL = function () {
    // 场景
    this.scene = null;
    // 相机
    this.camera = null;
    // 灯光
    this.light1 = null;
    this.light2 = null;
    // 控件对象
    this.controls = null;

}

GeoGL.prototype = {
    init: function (dom) {
        this._initScene();
        this._initCamera();
        this._initControls()
        this._initLight()
        this._initGUI()
    },
    /* 
    初始化场景设置
     */
    _initScene: function () {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2200ff);
    },

    /* 
    初始化相机设置
    PerspectiveCamera透视相机
      param1 视角即可以看到的角度范围，人的视场大约是180度，一般游戏的视场为60度到90度，推荐默认值45
      param2 长宽比决定了水平视角和垂直视角之间的比例关系
      param3 基于相机位置，表示从这里开始渲染场景；一般会设置一个很小的值，推荐默认值0.1
      param4 基于相机位置，表示停止渲染的位置；要注意设置合适的距离，如果设置太小，部分场景可能渲染不到，但如果设置的太大，会影响渲染的效率，默认值1000
     */
    _initCamera: function () {
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(20, 20, 20)
    },

    /* 
    初始化光源设置
    HemisphereLight半球光：光照颜色从天空光线颜色渐变到地面光线颜色
    position.set假如这个值设置等于 Object3D.DefaultUp (0, 1, 0),那么光线将会从上往下照射
     */
    _initLight: function () {
        this.light1 = new THREE.HemisphereLight(0xffffff, 0x111188)
        this.light2 = new THREE.HemisphereLight(0xbb2233, 0x080820, 0.5)
        this.light1.position.set(-1, 1, 1);
        this.light2.position.set(-1, -1.5, -1)
    },

    /* 
    初始化鼠标控件
    使动画循环使用时阻尼或自转 意思是否有惯性
    是否可以缩放
    是否开启右键拖拽
    */
    _initControls: function () {
        this.controls = new OrbitControls();
        this.controls.enableDamping = true;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
    }
}

export default GeoGL;
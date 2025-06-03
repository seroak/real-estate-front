/**
 * Copyright 2016 NAVER Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 마커 클러스터링을 정의합니다.
 * @param {Object} options 마커 클러스터링 옵션
 */

declare const naver: any;

export default function MarkerClustering(this: any, options: any) {
  // 기본 값입니다.
  this.DEFAULT_OPTIONS = {
    // 클러스터 마커를 올릴 지도입니다.
    map: null,
    // 클러스터 마커를 구성할 마커입니다.
    markers: [],
    // 클러스터 마커 클릭 시 줌 동작 여부입니다.
    disableClickZoom: true,
    // 클러스터를 구성할 최소 마커 수입니다.
    minClusterSize: 2,
    // 클러스터 마커로 표현할 최대 줌 레벨입니다. 해당 줌 레벨보다 높으면, 클러스터를 구성하고 있는 마커를 노출합니다.
    maxZoom: 13,
    // 클러스터를 구성할 그리드 크기입니다. 단위는 픽셀입니다.
    gridSize: 100,
    // 클러스터 마커의 아이콘입니다. NAVER Maps JavaScript API v3에서 제공하는 아이콘, 심볼, HTML 마커 유형을 모두 사용할 수 있습니다.
    icons: [],
    // 클러스터 마커의 아이콘 배열에서 어떤 아이콘을 선택할 것인지 인덱스를 결정합니다.
    indexGenerator: [10, 100, 200, 500, 1000],
    // 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부입니다.
    averageCenter: false,
    // 클러스터 마커를 갱신할 때 호출하는 콜백함수입니다. 이 함수를 통해 클러스터 마커에 개수를 표현하는 등의 엘리먼트를 조작할 수 있습니다.
    stylingFunction: function () {},
  };

  this._clusters = [];

  this._mapRelations = null;
  this._markerRelations = [];

  this.setOptions(naver.maps.Util.extend({}, this.DEFAULT_OPTIONS, options), true);
  this.setMap(options.map || null);
}
if (typeof window !== "undefined" && window.naver) {
  naver.maps.Util.ClassExtend(MarkerClustering, naver.maps.OverlayView, {
    onAdd: function () {
      var map = this.getMap();

      this._mapRelations = naver.maps.Event.addListener(map, "idle", naver.maps.Util.bind(this._onIdle, this));

      if (this.getMarkers().length > 0) {
        this._createClusters();
        this._updateClusters();
      }
    },

    draw: naver.maps.Util.noop,

    onRemove: function () {
      naver.maps.Event.removeListener(this._mapRelation);

      this._clearClusters();

      this._geoTree = null;
      this._mapRelation = null;
    },

    /**
     * 마커 클러스터링 옵션을 설정합니다. 설정한 옵션만 반영됩니다.
     * @param {Object | string} newOptions 옵션
     */
    setOptions: function (newOptions: any) {
      var _this = this;

      if (typeof newOptions === "string") {
        var key = newOptions,
          value = arguments[1];

        _this.set(key, value);
      } else {
        var isFirst = arguments[1];

        naver.maps.Util.forEach(newOptions, function (value: any, key: any) {
          if (key !== "map") {
            _this.set(key, value);
          }
        });

        if (newOptions.map && !isFirst) {
          _this.setMap(newOptions.map);
        }
      }
    },

    /**
     * 마커 클러스터링 옵션을 반환합니다. 특정 옵션 이름을 지정하지 않으면, 모든 옵션을 반환합니다.
     * @param {string} key 반환받을 옵션 이름
     * @return {Any} 옵션
     */
    getOptions: function (key: any) {
      var _this = this,
        options: { [key: string]: any } = {};

      if (key !== undefined) {
        return _this.get(key);
      } else {
        naver.maps.Util.forEach(_this.DEFAULT_OPTIONS, function (value: any, key: any) {
          options[key] = _this.get(key);
        });

        return options;
      }
    },

    /**
     * 클러스터를 구성하는 최소 마커 수를 반환합니다.
     * @return {number} 클러스터를 구성하는 최소 마커 수
     */
    getMinClusterSize: function () {
      return this.getOptions("minClusterSize");
    },

    /**
     * 클러스터를 구성하는 최소 마커 수를 설정합니다.
     * @param {number} size 클러스터를 구성하는 최소 마커 수
     */
    setMinClusterSize: function (size) {
      this.setOptions("minClusterSize", size);
    },

    /**
     * 클러스터 마커를 노출할 최대 줌 레벨을 반환합니다.
     * @return {number} 클러스터 마커를 노출할 최대 줌 레벨
     */
    getMaxZoom: function () {
      return this.getOptions("maxZoom");
    },

    /**
     * 클러스터 마커를 노출할 최대 줌 레벨을 설정합니다.
     * @param {number} zoom 클러스터 마커를 노출할 최대 줌 레벨
     */
    setMaxZoom: function (zoom) {
      this.setOptions("maxZoom", zoom);
    },

    /**
     * 클러스터를 구성할 그리드 크기를 반환합니다. 단위는 픽셀입니다.
     * @return {number} 클러스터를 구성할 그리드 크기
     */
    getGridSize: function () {
      return this.getOptions("gridSize");
    },

    /**
     * 클러스터를 구성할 그리드 크기를 설정합니다. 단위는 픽셀입니다.
     * @param {number} size 클러스터를 구성할 그리드 크기
     */
    setGridSize: function (size) {
      this.setOptions("gridSize", size);
    },

    /**
     * 클러스터 마커의 아이콘을 결정하는 인덱스 생성기를 반환합니다.
     * @return {Array | Function} 인덱스 생성기
     */
    getIndexGenerator: function () {
      return this.getOptions("indexGenerator");
    },

    /**
     * 클러스터 마커의 아이콘을 결정하는 인덱스 생성기를 설정합니다.
     * @param {Array | Function} indexGenerator 인덱스 생성기
     */
    setIndexGenerator: function (indexGenerator) {
      this.setOptions("indexGenerator", indexGenerator);
    },

    /**
     * 클러스터로 구성할 마커를 반환합니다.
     * @return {Array.<naver.maps.Marker>} 클러스터로 구성할 마커
     */
    getMarkers: function () {
      return this.getOptions("markers");
    },

    /**
     * 클러스터로 구성할 마커를 설정합니다.
     * @param {Array.<naver.maps.Marker>} markers 클러스터로 구성할 마커
     */
    setMarkers: function (markers) {
      this.setOptions("markers", markers);
    },

    /**
     * 클러스터 마커 아이콘을 반환합니다.
     * @return {Array.<naver.maps.Marker~ImageIcon | naver.maps.Marker~SymbolIcon | naver.maps.Marker~HtmlIcon>} 클러스터 마커 아이콘
     */
    getIcons: function () {
      return this.getOptions("icons");
    },

    /**
     * 클러스터 마커 아이콘을 설정합니다.
     * @param {Array.<naver.maps.Marker~ImageIcon | naver.maps.Marker~SymbolIcon | naver.maps.Marker~HtmlIcon>} icons 클러스터 마커 아이콘
     */
    setIcons: function (icons) {
      this.setOptions("icons", icons);
    },

    /**
     * 클러스터 마커의 엘리먼트를 조작할 수 있는 스타일링 함수를 반환합니다.
     * @return {Funxtion} 콜백함수
     */
    getStylingFunction: function () {
      return this.getOptions("stylingFunction");
    },

    /**
     * 클러스터 마커의 엘리먼트를 조작할 수 있는 스타일링 함수를 설정합니다.
     * @param {Function} func 콜백함수
     */
    setStylingFunction: function (func) {
      this.setOptions("stylingFunction", func);
    },

    /**
     * 클러스터 마커를 클릭했을 때 줌 동작 수행 여부를 반환합니다.
     * @return {boolean} 줌 동작 수행 여부
     */
    getDisableClickZoom: function () {
      return this.getOptions("disableClickZoom");
    },

    /**
     * 클러스터 마커를 클릭했을 때 줌 동작 수행 여부를 설정합니다.
     * @param {boolean} flag 줌 동작 수행 여부
     */
    setDisableClickZoom: function (flag) {
      this.setOptions("disableClickZoom", flag);
    },

    /**
     * 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부를 반환합니다.
     * @return {boolean} 평균 좌표로 클러스터링 여부
     */
    getAverageCenter: function () {
      return this.getOptions("averageCenter");
    },

    /**
     * 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부를 설정합니다.
     * @param {boolean} averageCenter 평균 좌표로 클러스터링 여부
     */
    setAverageCenter: function (averageCenter) {
      this.setOptions("averageCenter", averageCenter);
    },

    // KVO 이벤트 핸들러
    changed: function (key, value) {
      if (!this.getMap()) return;

      switch (key) {
        case "marker":
        case "minClusterSize":
        case "gridSize":
        case "averageCenter":
          this._redraw();
          break;
        case "indexGenerator":
        case "icons":
          this._clusters.forEach(function (cluster) {
            cluster.updateIcon();
          });
          break;
        case "maxZoom":
          this._clusters.forEach(function (cluster) {
            if (cluster.getCount() > 1) {
              cluster.checkByZoomAndMinClusterSize();
            }
          });
          break;
        case "stylingFunction":
          this._clusters.forEach(function (cluster) {
            cluster.updateCount();
          });
          break;
        case "disableClickZoom":
          var exec = "enableClickZoom";

          if (value) {
            exec = "disableClickZoom";
          }

          this._clusters.forEach(function (cluster) {
            cluster[exec]();
          });
          break;
      }
    },

    /**
     * 현재 지도 경계 영역 내의 마커에 대해 클러스터를 생성합니다.
     * @private
     */
    _createClusters: function () {
      var map = this.getMap();

      if (!map) return;

      var bounds = map.getBounds(),
        markers = this.getMarkers();

      for (var i = 0, ii = markers.length; i < ii; i++) {
        var marker = markers[i],
          position = marker.getPosition();

        if (!bounds.hasLatLng(position)) continue;

        var closestCluster = this._getClosestCluster(position);

        closestCluster.addMarker(marker);

        this._markerRelations.push(
          naver.maps.Event.addListener(marker, "dragend", naver.maps.Util.bind(this._onDragEnd, this))
        );
      }
    },

    /**
     * 클러스터의 아이콘, 텍스트를 갱신합니다.
     * @private
     */
    _updateClusters: function () {
      var clusters = this._clusters;

      for (var i = 0, ii = clusters.length; i < ii; i++) {
        clusters[i].updateCluster();
      }
    },

    /**
     * 클러스터를 모두 제거합니다.
     * @private
     */
    _clearClusters: function () {
      var clusters = this._clusters;

      for (var i = 0, ii = clusters.length; i < ii; i++) {
        clusters[i].destroy();
      }

      naver.maps.Event.removeListener(this._markerRelations);

      this._markerRelations = [];
      this._clusters = [];
    },

    /**
     * 생성된 클러스터를 모두 제거하고, 다시 생성합니다.
     * @private
     */
    _redraw: function () {
      this._clearClusters();
      this._createClusters();
      this._updateClusters();
    },

    /**
     * 전달된 위/경도에서 가장 가까운 클러스터를 반환합니다. 없으면 새로 클러스터를 생성해 반환합니다.
     * @param {naver.maps.LatLng} position 위/경도
     * @return {Cluster} 클러스터
     */
    _getClosestCluster: function (position) {
      var proj = this.getProjection(),
        clusters = this._clusters,
        closestCluster = null,
        distance = Infinity;

      for (var i = 0, ii = clusters.length; i < ii; i++) {
        var cluster = clusters[i],
          center = cluster.getCenter();

        if (cluster.isInBounds(position)) {
          var delta = proj.getDistance(center, position);

          if (delta < distance) {
            distance = delta;
            closestCluster = cluster;
          }
        }
      }

      if (!closestCluster) {
        closestCluster = new Cluster(this);
        this._clusters.push(closestCluster);
      }

      return closestCluster;
    },

    /**
     * 지도의 Idle 상태 이벤트 핸들러입니다.
     */
    _onIdle: function () {
      this._redraw();
    },

    /**
     * 각 마커의 드래그 종료 이벤트 핸들러입니다.
     */
    _onDragEnd: function () {
      this._redraw();
    },
  });
}
/**
 * 마커를 가지고 있는 클러스터를 정의합니다.
 * @param {MarkerClustering} markerClusterer
 */
function Cluster(this: any, markerClusterer: any) {
  this._clusterCenter = null;
  this._clusterBounds = null;
  this._clusterMarker = null;
  this._relation = null;

  this._clusterMember = [];

  this._markerClusterer = markerClusterer;
}

Cluster.prototype = {
  constructor: Cluster,

  /**
   * 클러스터에 마커를 추가합니다.
   * @param {naver.maps.Marker} marker 클러스터에 추가할 마커
   */
  addMarker: function (marker) {
    if (this._isMember(marker)) return;

    if (!this._clusterCenter) {
      var position = marker.getPosition();

      this._clusterCenter = position;
      this._clusterBounds = this._calcBounds(position);
    }

    this._clusterMember.push(marker);
  },

  /**
   * 클러스터를 제거합니다.
   */
  destroy: function () {
    naver.maps.Event.removeListener(this._relation);

    var members = this._clusterMember;

    for (var i = 0, ii = members.length; i < ii; i++) {
      members[i].setMap(null);
    }

    this._clusterMarker.setMap(null);

    this._clusterMarker = null;
    this._clusterCenter = null;
    this._clusterBounds = null;
    this._relation = null;

    this._clusterMember = [];
  },

  /**
   * 클러스터 중심점을 반환합니다.
   * @return {naver.maps.LatLng} 클러스터 중심점
   */
  getCenter: function () {
    return this._clusterCenter;
  },

  /**
   * 클러스터 경계 영역을 반환합니다.
   * @return {naver.maps.LatLngBounds} 클러스터 경계 영역
   */
  getBounds: function () {
    return this._clusterBounds;
  },

  /**
   * 클러스터를 구성하는 마커 수를 반환합니다.
   * @return {number} 클러스터를 구성하는 마커 수
   */
  getCount: function () {
    return this._clusterMember.length;
  },

  /**
   * 현재의 클러스터 멤버 마커 객체를 반환합니다.
   * @return {naver.maps.Marker[]} 클러스터를 구성하는 마커 객체 집합
   */
  getClusterMember: function () {
    return this._clusterMember;
  },

  /**
   * 전달된 위/경도가 클러스터 경계 영역 내에 있는지 여부를 반환합니다.
   * @param {naver.maps.LatLng} latlng 위/경도
   * @return {boolean} 클러스터 경계 영역 내의 위치 여부
   */
  isInBounds: function (latlng) {
    return this._clusterBounds && this._clusterBounds.hasLatLng(latlng);
  },

  /**
   * 클러스터 마커 클릭 시 줌 동작을 수행하도록 합니다.
   */
  enableClickZoom: function () {
    if (this._relation) return;

    var map = this._markerClusterer.getMap();

    this._relation = naver.maps.Event.addListener(
      this._clusterMarker,
      "click",
      naver.maps.Util.bind(function (e) {
        map.morph(e.coord, map.getZoom() + 1);
      }, this)
    );
  },

  /**
   * 클러스터 마커 클릭 시 줌 동작을 수행하지 않도록 합니다.
   */
  disableClickZoom: function () {
    if (!this._relation) return;

    naver.maps.Event.removeListener(this._relation);
    this._relation = null;
  },

  /**
   * 클러스터 마커가 없으면 클러스터 마커를 생성하고, 클러스터 마커를 갱신합니다.
   * - 클러스터 마커 아이콘
   * - 마커 개수
   * - 클러스터 마커 노출 여부
   */
  updateCluster: function () {
    if (!this._clusterMarker) {
      var position;

      if (this._markerClusterer.getAverageCenter()) {
        position = this._calcAverageCenter(this._clusterMember);
      } else {
        position = this._clusterCenter;
      }

      this._clusterMarker = new naver.maps.Marker({
        position: position,
        map: this._markerClusterer.getMap(),
      });

      if (!this._markerClusterer.getDisableClickZoom()) {
        this.enableClickZoom();
      }
    }

    this.updateIcon();
    this.updateCount();

    this.checkByZoomAndMinClusterSize();
  },

  /**
   * 조건에 따라 클러스터 마커를 노출하거나, 노출하지 않습니다.
   */
  checkByZoomAndMinClusterSize: function () {
    var clusterer = this._markerClusterer,
      minClusterSize = clusterer.getMinClusterSize(),
      maxZoom = clusterer.getMaxZoom(),
      currentZoom = clusterer.getMap().getZoom();

    if (this.getCount() < minClusterSize) {
      this._showMember();
    } else {
      this._hideMember();

      if (maxZoom <= currentZoom) {
        this._showMember();
      }
    }
  },

  /**
   * 클러스터를 구성하는 마커 수를 갱신합니다.
   */
  updateCount: function () {
    var stylingFunction = this._markerClusterer.getStylingFunction();

    stylingFunction && stylingFunction(this._clusterMarker, this.getCount());
  },

  /**
   * 클러스터 마커 아이콘을 갱신합니다.
   */
  updateIcon: function () {
    var count = this.getCount(),
      index = this._getIndex(count),
      icons = this._markerClusterer.getIcons();

    index = Math.max(index, 0);
    index = Math.min(index, icons.length - 1);
    console.log("🧩 클러스터 icon 객체", icons);
    this._clusterMarker.setIcon(icons[index]);
  },

  /**
   * 클러스터를 구성하는 마커를 노출합니다. 이때에는 클러스터 마커를 노출하지 않습니다.
   * @private
   */
  _showMember: function () {
    var map = this._markerClusterer.getMap(),
      marker = this._clusterMarker,
      members = this._clusterMember;

    for (var i = 0, ii = members.length; i < ii; i++) {
      members[i].setMap(map);
    }

    if (marker) {
      marker.setMap(null);
    }
  },

  /**
   * 클러스터를 구성하는 마커를 노출하지 않습니다. 이때에는 클러스터 마커를 노출합니다.
   * @private
   */
  _hideMember: function () {
    var map = this._markerClusterer.getMap(),
      marker = this._clusterMarker,
      members = this._clusterMember;

    for (var i = 0, ii = members.length; i < ii; i++) {
      members[i].setMap(null);
    }

    if (marker && !marker.getMap()) {
      marker.setMap(map);
    }
  },

  /**
   * 전달된 위/경도를 중심으로 그리드 크기만큼 확장한 클러스터 경계 영역을 반환합니다.
   * @param {naver.maps.LatLng} position 위/경도
   * @return {naver.maps.LatLngBounds} 클러스터 경계 영역
   * @private
   */
  _calcBounds: function (position) {
    var map = this._markerClusterer.getMap(),
      bounds = new naver.maps.LatLngBounds(position.clone(), position.clone()),
      mapBounds = map.getBounds(),
      proj = map.getProjection(),
      map_max_px = proj.fromCoordToOffset(mapBounds.getNE()),
      map_min_px = proj.fromCoordToOffset(mapBounds.getSW()),
      max_px = proj.fromCoordToOffset(bounds.getNE()),
      min_px = proj.fromCoordToOffset(bounds.getSW()),
      gridSize = this._markerClusterer.getGridSize() / 2;

    max_px.add(gridSize, -gridSize);
    min_px.add(-gridSize, gridSize);

    var max_px_x = Math.min(map_max_px.x, max_px.x),
      max_px_y = Math.max(map_max_px.y, max_px.y),
      min_px_x = Math.max(map_min_px.x, min_px.x),
      min_px_y = Math.min(map_min_px.y, min_px.y),
      newMax = proj.fromOffsetToCoord(new naver.maps.Point(max_px_x, max_px_y)),
      newMin = proj.fromOffsetToCoord(new naver.maps.Point(min_px_x, min_px_y));

    return new naver.maps.LatLngBounds(newMin, newMax);
  },

  /**
   * 클러스터를 구성하는 마커 수에 따라 노출할 아이콘을 결정하기 위한 인덱스를 반환합니다.
   * @param {number} count 클러스터를 구성하는 마커 수
   * @return {number} 인덱스
   * @private
   */
  _getIndex: function (count) {
    var indexGenerator = this._markerClusterer.getIndexGenerator();

    if (naver.maps.Util.isFunction(indexGenerator)) {
      return indexGenerator(count);
    } else if (naver.maps.Util.isArray(indexGenerator)) {
      var index = 0;

      for (var i = index, ii = indexGenerator.length; i < ii; i++) {
        var factor = indexGenerator[i];

        if (count < factor) break;

        index++;
      }

      return index;
    }
  },

  /**
   * 전달된 마커가 이미 클러스터에 속해 있는지 여부를 반환합니다.
   * @param {naver.maps.Marker} marker 마커
   * @return {boolean} 클러스터에 속해 있는지 여부
   * @private
   */
  _isMember: function (marker) {
    return this._clusterMember.indexOf(marker) !== -1;
  },

  /**
   * 전달된 마커들의 중심 좌표를 반환합니다.
   * @param {Array.<naver.maps.Marker>} markers 마커 배열
   * @return {naver.maps.Point} 마커들의 중심 좌표
   * @private
   */
  _calcAverageCenter: function (markers) {
    var numberOfMarkers = markers.length;
    var averageCenter = [0, 0];

    for (var i = 0; i < numberOfMarkers; i++) {
      averageCenter[0] += markers[i].position.x;
      averageCenter[1] += markers[i].position.y;
    }

    averageCenter[0] /= numberOfMarkers;
    averageCenter[1] /= numberOfMarkers;

    return new naver.maps.Point(averageCenter[0], averageCenter[1]);
  },
} as any;

export { Cluster };

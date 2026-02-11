import React from 'react';
import PropTypes from 'prop-types';
import styles from './prescription.module.css';

const TeethGrid = ({ 
  selectedTeeth,
  onTeethSelection,
  onSelectAll,
  setSelectedTeeth,
  mode = 'restrictions'
}) => {
  const teethSet = selectedTeeth || new Set();
  
  return (
    <div className={styles.teethGrid}>
      <div className={styles.tout}>
        <div className={styles.toothBox}>
          <input 
            type="checkbox"
            checked={teethSet.size === 32}
            onChange={() => onSelectAll(mode)}
          />
        </div>
        Tout sélectionner
      </div>
      <div className={styles.teethRow}>
        <div className={styles.teethNumbers}>
          <span>18</span><span>17</span><span>16</span><span>15</span><span>14</span>
          <span>13</span><span>12</span><span>11</span><span>21</span><span>22</span>
          <span>23</span><span>24</span><span>25</span><span>26</span><span>27</span><span>28</span>
        </div>
        <div className={styles.teethBoxes}>
          {[...Array(16)].map((_, index) => (
            <div className={styles.toothBox} key={`upper-${index + 1}`}>
              <input 
                type="checkbox"
                checked={teethSet.has(index + 1)}
                onChange={() => onTeethSelection(index + 1, mode)}
              />
            </div>
          ))}
          <div className={styles.verticalLine}></div>
        </div>
      </div>
      <div className={styles.jawLabels}>
        <span className={styles.labelD}>D</span>
        <div className={styles.horizontalLine}></div>
        <span className={styles.labelG}>G</span>
      </div>
      <div className={styles.teethRow}>
        <div className={styles.teethNumbers}>
          <span>48</span><span>47</span><span>46</span><span>45</span><span>44</span>
          <span>43</span><span>42</span><span>41</span><span>31</span><span>32</span>
          <span>33</span><span>34</span><span>35</span><span>36</span><span>37</span><span>38</span>
        </div>
        <div className={styles.teethBoxes}>
          {[...Array(16)].map((_, index) => (
            <div className={styles.toothBox} key={`lower-${index + 17}`}>
              <input 
                type="checkbox"
                checked={teethSet.has(index + 17)}
                onChange={() => onTeethSelection(index + 17, mode)}
              />
            </div>
          ))}
          <div className={styles.verticalLine}></div>
        </div>
      </div>
    </div>
  );
};

TeethGrid.propTypes = {
  selectedTeeth: PropTypes.instanceOf(Set),
  onTeethSelection: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  setSelectedTeeth: PropTypes.func.isRequired,
  mode: PropTypes.string
};

TeethGrid.defaultProps = {
  selectedTeeth: new Set(),
  mode: 'restrictions'
};

export default TeethGrid;

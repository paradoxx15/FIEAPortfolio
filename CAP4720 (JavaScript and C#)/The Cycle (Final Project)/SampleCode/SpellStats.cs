using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// Required for spell to work with FireSpells Script
public class SpellStats : MonoBehaviour {

    public Vector3 spawnOffset;
    public Motion spellAnimation;
    public bool characterSpawn;
    public float spellRadius = 1f;
    public float lifeTime = 1f;
    public int spellAnimationSelector;

    private Vector3 spawnPoint;
    private GameObject spell;


	// Use this for initialization
	void Start () {
       
	}
	
	// Update is called once per frame
	void Update () {
		
	}

    // Spawns the object at targtet position plus offset
    public GameObject Spawn(Vector3 position)
    {
        spawnPoint = position + spawnOffset;
        spell = Instantiate(this.gameObject, spawnPoint, Quaternion.identity);
        return spell;
    }

    public GameObject Spawn(Vector3 position, Quaternion rotation)
    {
        spawnPoint = position + spawnOffset;
        spell = Instantiate(this.gameObject, spawnPoint, rotation);
        return spell;
    }

}
